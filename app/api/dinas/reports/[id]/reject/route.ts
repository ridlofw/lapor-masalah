// app/api/dinas/reports/[id]/reject/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// POST - Dinas rejects a report (returns to admin)
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
        const { reason } = body;

        if (!reason || reason.trim().length === 0) {
            return NextResponse.json(
                { error: "Alasan penolakan harus diisi" },
                { status: 400 }
            );
        }

        // Get report
        const report = await prisma.report.findUnique({
            where: { id: reportId },
            include: {
                dinas: true,
            },
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
                { error: "Laporan tidak dapat ditolak" },
                { status: 400 }
            );
        }

        // Update report - status becomes DITOLAK_DINAS which returns to admin
        const updatedReport = await prisma.report.update({
            where: { id: reportId },
            data: {
                status: "DITOLAK_DINAS",
                dinasNote: reason,
                dinasVerifiedAt: new Date(),
                dinasVerifiedBy: session.id,
                timeline: {
                    create: {
                        actorId: session.id,
                        eventType: "REJECTED_DINAS",
                        title: "Ditolak oleh Dinas",
                        description: `Laporan ditolak oleh ${report.dinas?.name || "Dinas"}. Alasan: ${reason}. Laporan dikembalikan ke Admin.`,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Laporan ditolak dan dikembalikan ke Admin",
            report: {
                id: updatedReport.id,
                status: updatedReport.status,
            },
        });
    } catch (error) {
        console.error("Dinas reject error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}
