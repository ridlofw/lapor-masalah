// app/api/dinas/reports/[id]/complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// POST - Complete a report
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
        const { completionNote, images } = body;

        if (!completionNote || completionNote.trim().length === 0) {
            return NextResponse.json(
                { error: "Laporan penyelesaian harus diisi" },
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
        if (report.status !== "DALAM_PENGERJAAN") {
            return NextResponse.json(
                { error: "Laporan tidak dalam tahap pengerjaan" },
                { status: 400 }
            );
        }

        // Update report
        const updatedReport = await prisma.report.update({
            where: { id: reportId },
            data: {
                status: "SELESAI",
                completionNote,
                completedAt: new Date(),
                // Add completion images
                images: images?.length > 0 ? {
                    create: images.map((url: string) => ({
                        url,
                        type: "PENYELESAIAN" as const,
                    })),
                } : undefined,
                timeline: {
                    create: {
                        actorId: session.id,
                        eventType: "COMPLETED",
                        title: "Laporan Selesai",
                        description: `Laporan telah diselesaikan oleh ${report.dinas?.name || "Dinas"}. ${completionNote}`,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Laporan berhasil diselesaikan",
            report: {
                id: updatedReport.id,
                status: updatedReport.status,
                completedAt: updatedReport.completedAt,
            },
        });
    } catch (error) {
        console.error("Complete report error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}
