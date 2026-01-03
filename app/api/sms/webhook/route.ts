// app/api/sms/webhook/route.ts
// Webhook endpoint untuk menerima SMS dari httpSMS

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Format SMS yang diharapkan:
// LAPOR#KATEGORI#LOKASI#DESKRIPSI
// Contoh: LAPOR#JALAN#Jl. Sudirman No 10#Jalan berlubang sangat besar

// httpSMS Webhook Payload
interface HttpSMSWebhookPayload {
    data: {
        id: string;
        owner: string;
        user_id: string;
        contact: string;      // Nomor pengirim
        content: string;      // Isi SMS
        type: "mobile-originated" | "mobile-terminated";
        status: "pending" | "sent" | "delivered" | "failed" | "received";
        sim: "SIM1" | "SIM2";
        request_received_at: string;
        created_at: string;
        updated_at: string;
    };
    type: "message.phone.received" | "message.phone.sent" | "message.phone.delivered" | "message.send.failed";
}

// Mapping kategori dari SMS ke enum database
const CATEGORY_MAP: Record<string, "JALAN" | "JEMBATAN" | "SEKOLAH" | "KESEHATAN" | "AIR" | "LISTRIK"> = {
    "JALAN": "JALAN",
    "JEMBATAN": "JEMBATAN",
    "SEKOLAH": "SEKOLAH",
    "KESEHATAN": "KESEHATAN",
    "AIR": "AIR",
    "LISTRIK": "LISTRIK",
};

// Koordinat default (akan di-update oleh admin jika perlu)
const DEFAULT_COORDINATES = {
    latitude: -6.2088,  // Jakarta sebagai default
    longitude: 106.8456,
};

export async function POST(request: NextRequest) {
    try {
        // Parse payload dari httpSMS
        const payload: HttpSMSWebhookPayload = await request.json();

        console.log("📱 [SMS Webhook] Received payload:", JSON.stringify(payload, null, 2));

        // Hanya proses event "message.phone.received"
        if (payload.type !== "message.phone.received") {
            console.log(`ℹ️ [SMS Webhook] Skipping event type: ${payload.type}`);
            return NextResponse.json({
                success: true,
                message: "Event type not processed",
                type: payload.type
            });
        }

        const { contact: senderPhone, content: smsText } = payload.data;

        console.log(`📱 [SMS Webhook] SMS diterima dari ${senderPhone}: ${smsText}`);

        // Parse SMS dengan format baru: LAPOR#KATEGORI#LOKASI#DESKRIPSI
        const parsed = parseSMS(smsText);

        if (!parsed.valid) {
            console.log(`❌ [SMS Webhook] Format SMS tidak valid: ${parsed.error}`);

            // Return success (tidak error) tapi tidak buat laporan
            // Agar httpSMS tidak retry
            return NextResponse.json({
                success: false,
                error: parsed.error,
                hint: "Format: LAPOR#KATEGORI#LOKASI#DESKRIPSI",
                example: "LAPOR#JALAN#Jl. Sudirman No 10#Jalan berlubang besar"
            });
        }

        // Cari user berdasarkan nomor telepon
        let user = await prisma.user.findFirst({
            where: { phone: senderPhone }
        });

        // Jika user tidak ditemukan, buat user baru untuk pelapor SMS
        if (!user) {
            // Generate email unik dari nomor telepon
            const cleanPhone = senderPhone.replace(/[^0-9]/g, "");
            const uniqueEmail = `sms_${cleanPhone}@sms.lapormasalah.local`;

            user = await prisma.user.create({
                data: {
                    email: uniqueEmail,
                    password: "", // User SMS tidak bisa login via web
                    name: "Pelapor via SMS",
                    phone: senderPhone, // Nomor disimpan di user, hanya visible untuk admin
                    role: "USER",
                }
            });
            console.log(`👤 [SMS Webhook] User baru dibuat untuk nomor ${senderPhone}`);
        }

        // Buat laporan baru (tanpa nomor telepon di deskripsi - hanya admin yang bisa lihat)
        const report = await prisma.report.create({
            data: {
                userId: user.id,
                category: parsed.category!,
                description: parsed.description!, // Deskripsi asli tanpa info nomor
                locationText: parsed.location!,
                latitude: DEFAULT_COORDINATES.latitude,
                longitude: DEFAULT_COORDINATES.longitude,
                status: "MENUNGGU_VERIFIKASI",
            }
        });

        // Buat timeline entry (tanpa nomor telepon - privasi pelapor)
        await prisma.reportTimeline.create({
            data: {
                reportId: report.id,
                actorId: user.id,
                eventType: "CREATED",
                title: "Laporan dibuat via SMS",
                description: `Laporan diterima via SMS\n\nKategori: ${parsed.category}\nLokasi: ${parsed.location}`,
            }
        });

        console.log(`✅ [SMS Webhook] Laporan berhasil dibuat: ${report.id}`);

        return NextResponse.json({
            success: true,
            reportId: report.id,
            message: "Laporan berhasil diterima dan dibuat"
        });

    } catch (error) {
        console.error("❌ [SMS Webhook] Error processing webhook:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

// Fungsi untuk parsing format SMS
// Format: LAPOR#KATEGORI#LOKASI#DESKRIPSI
function parseSMS(text: string): {
    valid: boolean;
    category?: "JALAN" | "JEMBATAN" | "SEKOLAH" | "KESEHATAN" | "AIR" | "LISTRIK";
    location?: string;
    description?: string;
    error?: string;
} {
    const trimmed = text.trim();

    // Cek apakah dimulai dengan LAPOR (case insensitive)
    if (!trimmed.toUpperCase().startsWith("LAPOR#")) {
        return {
            valid: false,
            error: "SMS harus dimulai dengan LAPOR#"
        };
    }

    // Split by #
    const parts = trimmed.split("#");

    // Harus ada 4 bagian: LAPOR, KATEGORI, LOKASI, DESKRIPSI
    if (parts.length < 4) {
        return {
            valid: false,
            error: "Format tidak lengkap. Gunakan: LAPOR#KATEGORI#LOKASI#DESKRIPSI"
        };
    }

    // parts[0] = "LAPOR"
    const categoryWord = parts[1].trim().toUpperCase();
    const location = parts[2].trim();
    // Gabungkan sisa parts jika ada # di deskripsi
    const description = parts.slice(3).join("#").trim();

    // Validasi kategori
    if (!CATEGORY_MAP[categoryWord]) {
        return {
            valid: false,
            error: `Kategori "${categoryWord}" tidak valid. Gunakan: ${Object.keys(CATEGORY_MAP).join(", ")}`
        };
    }

    // Validasi lokasi
    if (!location) {
        return {
            valid: false,
            error: "Lokasi tidak boleh kosong"
        };
    }

    // Validasi deskripsi
    if (!description) {
        return {
            valid: false,
            error: "Deskripsi tidak boleh kosong"
        };
    }

    return {
        valid: true,
        category: CATEGORY_MAP[categoryWord],
        location,
        description
    };
}

// GET handler untuk testing
export async function GET() {
    return NextResponse.json({
        status: "ok",
        message: "SMS Webhook endpoint is active",
        format: "LAPOR#KATEGORI#LOKASI#DESKRIPSI",
        categories: Object.keys(CATEGORY_MAP),
        example: "LAPOR#JALAN#Jl. Sudirman No 10#Jalan berlubang besar sudah 2 minggu"
    });
}
