// app/api/dinas/reports/[id]/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// POST - Dinas verifies a report
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession("DINAS");

        if (!session || session.role !== "DINAS" || !session.dinasId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: reportId } = await params;
        const body = await request.json();
        const { note } = body;

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

        // Check if report belongs to this dinas
        if (report.dinasId !== session.dinasId) {
            return NextResponse.json(
                { error: "Laporan bukan milik dinas Anda" },
                { status: 403 }
            );
        }

        // Check valid status
        if (report.status !== "DIDISPOSISIKAN") {
            return NextResponse.json(
                { error: "Laporan tidak dapat diverifikasi" },
                { status: 400 }
            );
        }

        // Update report
        const updatedReport = await prisma.report.update({
            where: { id: reportId },
            data: {
                status: "DIVERIFIKASI_DINAS",
                dinasNote: note,
                dinasVerifiedAt: new Date(),
                dinasVerifiedBy: session.id,
                timeline: {
                    create: {
                        actorId: session.id,
                        eventType: "VERIFIED_DINAS",
                        title: "Diverifikasi Dinas",
                        description: `Laporan diverifikasi oleh dinas. ${note ? `Catatan: ${note}` : ""}`,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Laporan berhasil diverifikasi",
            report: {
                id: updatedReport.id,
                status: updatedReport.status,
            },
        });
    } catch (error) {
        console.error("Dinas verify error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}
