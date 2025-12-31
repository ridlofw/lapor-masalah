// app/api/reports/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get single report detail with full timeline
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const report = await prisma.report.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                dinas: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                    },
                },
                images: true,
                timeline: {
                    include: {
                        actor: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
                progress: {
                    include: {
                        dinasUser: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        images: true,
                    },
                    orderBy: { createdAt: "desc" },
                },
                _count: {
                    select: {
                        supports: true,
                    },
                },
            },
        });

        if (!report) {
            return NextResponse.json(
                { error: "Laporan tidak ditemukan" },
                { status: 404 }
            );
        }

        // Check if current user has supported this report
        // This would need session check in real implementation

        return NextResponse.json({
            report: {
                id: report.id,
                category: report.category,
                description: report.description,
                locationText: report.locationText,
                latitude: report.latitude,
                longitude: report.longitude,
                status: report.status,
                supportCount: report._count.supports,
                images: report.images.map((img) => ({
                    id: img.id,
                    url: img.url,
                    type: img.type,
                })),
                reporter: report.user,
                dinas: report.dinas,
                budget: report.budgetTotal ? {
                    total: report.budgetTotal.toString(),
                    used: report.budgetUsed?.toString() || "0",
                    percentage: report.budgetTotal
                        ? Math.round(
                            (Number(report.budgetUsed || 0) / Number(report.budgetTotal)) * 100
                        )
                        : 0,
                } : null,
                rejectionReason: report.rejectionReason,
                adminNote: report.adminNote,
                dinasNote: report.dinasNote,
                completionNote: report.completionNote,
                timeline: report.timeline.map((t) => ({
                    id: t.id,
                    eventType: t.eventType,
                    title: t.title,
                    description: t.description,
                    budgetUsed: t.budgetUsed?.toString(),
                    actor: t.actor,
                    createdAt: t.createdAt,
                })),
                progress: report.progress.map((p) => ({
                    id: p.id,
                    description: p.description,
                    budgetUsed: p.budgetUsed.toString(),
                    images: p.images.map((img) => img.url),
                    createdBy: p.dinasUser,
                    createdAt: p.createdAt,
                })),
                createdAt: report.createdAt,
                updatedAt: report.updatedAt,
            },
        });
    } catch (error) {
        console.error("Get report error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mengambil data laporan" },
            { status: 500 }
        );
    }
}
