
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ReportStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
    try {
        const session = await getSession("ADMIN");

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const range = searchParams.get("range") || "monthly";

        const now = new Date();
        let startDate = new Date();
        let groupByFormat = "day"; // day | month

        if (range === "weekly") {
            // Last 7 days
            startDate.setDate(now.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);
        } else if (range === "monthly") {
            // Last 30 days or current month? 
            // "Perbulan" usually means this month's daily breakdown or last 30 days.
            // Let's do last 30 days for better visualization availability
            startDate.setDate(now.getDate() - 29);
            startDate.setHours(0, 0, 0, 0);
        } else if (range === "yearly") {
            // Current year, grouped by month
            startDate = new Date(now.getFullYear(), 0, 1);
            groupByFormat = "month";
        }

        const reports = await prisma.report.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                },
            },
            select: {
                createdAt: true,
                status: true,
            },
        });

        // Initialize aggregation map
        const dataMap = new Map<string, { name: string, selesai: number, progress: number, unverified: number }>();

        // Helper to format date key
        const formatDateKey = (date: Date) => {
            if (groupByFormat === "day") {
                return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
            } else {
                return date.toLocaleDateString("id-ID", { month: "short" });
            }
        };

        // Initialize the buckets to ensure all dates/months are shown even if 0
        if (range === "weekly" || range === "monthly") {
            const tempDate = new Date(startDate);
            while (tempDate <= now) {
                const key = formatDateKey(tempDate);
                dataMap.set(key, { name: key, selesai: 0, progress: 0, unverified: 0 });
                tempDate.setDate(tempDate.getDate() + 1);
            }
        } else if (range === "yearly") {
            for (let i = 0; i < 12; i++) {
                const tempDate = new Date(now.getFullYear(), i, 1);
                // Don't go beyond current month if strict, but for yearly view usually showing full year buckets is fine or up to current month.
                // Let's show up to 12 months for consistency
                const key = formatDateKey(tempDate);
                dataMap.set(key, { name: key, selesai: 0, progress: 0, unverified: 0 });
            }
        }

        // Fill data
        reports.forEach(report => {
            const key = formatDateKey(new Date(report.createdAt));
            if (dataMap.has(key)) {
                const entry = dataMap.get(key)!;
                if (report.status === "SELESAI") {
                    entry.selesai++;
                } else if (["MENUNGGU_VERIFIKASI", "DITOLAK_DINAS"].includes(report.status)) { // Group "returned" as unverified/pending for admin action
                    entry.unverified++;
                } else {
                    // All other statuses are "IN PROGRESS"
                    entry.progress++;
                }
            }
        });

        const chartData = Array.from(dataMap.values());

        return NextResponse.json({ data: chartData });

    } catch (error) {
        console.error("Fetch chart stats error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mengambil statistik" },
            { status: 500 }
        );
    }
}
