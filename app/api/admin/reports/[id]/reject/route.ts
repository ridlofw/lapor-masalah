// app/api/admin/reports/[id]/reject/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// POST - Reject a report
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
        });

        if (!report) {
            return NextResponse.json(
                { error: "Laporan tidak ditemukan" },
                { status: 404 }
            );
        }

        // Check valid status for rejection
        if (report.status !== "MENUNGGU_VERIFIKASI" && report.status !== "DITOLAK_DINAS") {
            return NextResponse.json(
                { error: "Laporan tidak dapat ditolak" },
                { status: 400 }
            );
        }

        // Update report
        const updatedReport = await prisma.report.update({
            where: { id: reportId },
            data: {
                status: "DITOLAK",
                rejectionReason: reason,
                rejectedAt: new Date(),
                rejectedBy: session.id,
                timeline: {
                    create: {
                        actorId: session.id,
                        eventType: "REJECTED_ADMIN",
                        title: "Ditolak oleh Admin",
                        description: `Laporan ditolak. Alasan: ${reason}`,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Laporan berhasil ditolak",
            report: {
                id: updatedReport.id,
                status: updatedReport.status,
            },
        });
    } catch (error) {
        console.error("Reject report error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menolak laporan" },
            { status: 500 }
        );
    }
}
