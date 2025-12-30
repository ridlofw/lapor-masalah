// app/api/dinas/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Get dinas dashboard stats
export async function GET() {
    try {
        const session = await getSession("DINAS");

        if (!session || session.role !== "DINAS" || !session.dinasId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const dinasId = session.dinasId;

        // Get counts for each status
        const [
            totalReports,
            pendingCount,
            progressCount,
            completedCount,
            rejectedCount,
            recentReports,
            totalBudget,
        ] = await Promise.all([
            prisma.report.count({ where: { dinasId } }),
            prisma.report.count({
                where: { dinasId, status: "DIDISPOSISIKAN" },
            }),
            prisma.report.count({
                where: {
                    dinasId,
                    status: { in: ["DIVERIFIKASI_DINAS", "DALAM_PENGERJAAN"] },
                },
            }),
            prisma.report.count({
                where: { dinasId, status: "SELESAI" },
            }),
            prisma.report.count({
                where: { dinasId, status: "DITOLAK_DINAS" },
            }),
            prisma.report.findMany({
                where: { dinasId },
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: {
                            name: true,
                            avatar: true,
                        },
                    },
                },
            }),
            prisma.report.aggregate({
                where: { dinasId, status: "SELESAI" },
                _sum: {
                    budgetUsed: true,
                },
            }),
        ]);

        // Get dinas info
        const dinas = await prisma.dinas.findUnique({
            where: { id: dinasId },
        });

        // Get category distribution
        const categoryStats = await prisma.report.groupBy({
            by: ["category"],
            where: { dinasId },
            _count: true,
        });

        return NextResponse.json({
            dinas: dinas ? {
                id: dinas.id,
                name: dinas.name,
                type: dinas.type,
            } : null,
            stats: {
                total: totalReports,
                pending: pendingCount,
                progress: progressCount,
                completed: completedCount,
                rejected: rejectedCount,
                totalBudgetUsed: totalBudget._sum.budgetUsed?.toString() || "0",
            },
            categoryDistribution: categoryStats.map((c) => ({
                category: c.category,
                count: c._count,
            })),
            recentReports: recentReports.map((r) => ({
                id: r.id,
                category: r.category,
                status: r.status,
                locationText: r.locationText,
                reporter: r.user.name,
                createdAt: r.createdAt,
            })),
        });
    } catch (error) {
        console.error("Dinas stats error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}
