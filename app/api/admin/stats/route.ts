// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Get admin dashboard stats
export async function GET() {
    try {
        const session = await getSession("ADMIN");

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get counts for each status
        const [
            totalReports,
            pendingCount,
            progressCount,
            completedCount,
            rejectedCount,
            recentReports,
        ] = await Promise.all([
            prisma.report.count(),
            prisma.report.count({
                where: {
                    status: { in: ["MENUNGGU_VERIFIKASI", "DITOLAK_DINAS"] },
                },
            }),
            prisma.report.count({
                where: {
                    status: { in: ["DIDISPOSISIKAN", "DIVERIFIKASI_DINAS", "DALAM_PENGERJAAN"] },
                },
            }),
            prisma.report.count({
                where: { status: "SELESAI" },
            }),
            prisma.report.count({
                where: { status: "DITOLAK" },
            }),
            prisma.report.findMany({
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
        ]);

        // Get category distribution
        const categoryStats = await prisma.report.groupBy({
            by: ["category"],
            _count: true,
        });

        // Get monthly stats (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyReports = await prisma.report.groupBy({
            by: ["createdAt"],
            where: {
                createdAt: { gte: sixMonthsAgo },
            },
            _count: true,
        });

        return NextResponse.json({
            stats: {
                total: totalReports,
                pending: pendingCount,
                progress: progressCount,
                completed: completedCount,
                rejected: rejectedCount,
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
        console.error("Admin stats error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}
