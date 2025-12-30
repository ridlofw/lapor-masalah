// app/api/admin/reports/[id]/dispose/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ReportCategory, DinasType } from "@prisma/client";

// Map category to dinas type
const CATEGORY_TO_DINAS: Record<ReportCategory, DinasType> = {
    JALAN: "PUPR",
    JEMBATAN: "PUPR",
    SEKOLAH: "DIKNAS",
    KESEHATAN: "DINKES",
    AIR: "ESDM",
    LISTRIK: "ESDM",
};

// POST - Dispose report to appropriate dinas
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession("ADMIN");

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: reportId } = await params;
        const body = await request.json();
        const { note, dinasId } = body;

        // Get report
        const report = await prisma.report.findUnique({
            where: { id: reportId },
        });

        if (!report) {
            return NextResponse.json(
                { error: "Laporan tidak ditemukan" },
                { status: 404 }
            );
        }

        // Check valid status for disposition
        if (report.status !== "MENUNGGU_VERIFIKASI" && report.status !== "DITOLAK_DINAS") {
            return NextResponse.json(
                { error: "Laporan tidak dapat didisposisikan" },
                { status: 400 }
            );
        }

        let dinas;

        if (dinasId) {
            // Find explicitly selected Dinas
            dinas = await prisma.dinas.findUnique({
                where: { id: dinasId },
            });
        } else {
            // Get appropriate dinas based on category
            const dinasType = CATEGORY_TO_DINAS[report.category];
            dinas = await prisma.dinas.findUnique({
                where: { type: dinasType },
            });
        }

        if (!dinas) {
            return NextResponse.json(
                { error: "Dinas tidak ditemukan" },
                { status: 404 }
            );
        }

        // Update report with disposition
        const updatedReport = await prisma.report.update({
            where: { id: reportId },
            data: {
                status: "DIDISPOSISIKAN",
                dinasId: dinas.id,
                adminNote: note,
                adminVerifiedAt: new Date(),
                adminVerifiedBy: session.id,
                timeline: {
                    create: {
                        actorId: session.id,
                        eventType: "DISPOSED_TO_DINAS",
                        title: "Didisposisikan ke Dinas",
                        description: `Laporan diterima dan didisposisikan ke ${dinas.name}. ${note ? `Catatan: ${note}` : ""}`,
                    },
                },
            },
            include: {
                dinas: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: `Laporan berhasil didisposisikan ke ${dinas.name}`,
            report: {
                id: updatedReport.id,
                status: updatedReport.status,
                dinas: updatedReport.dinas,
            },
        });
    } catch (error) {
        console.error("Dispose report error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mendisposisikan laporan" },
            { status: 500 }
        );
    }
}
