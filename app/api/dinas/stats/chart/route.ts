
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getSession("DINAS");

        if (!session || session.role !== "DINAS") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.id },
            select: { dinasId: true }
        });

        if (!user?.dinasId) {
            return NextResponse.json(
                { error: "User tidak terhubung dengan Dinas" },
                { status: 400 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const range = searchParams.get("range") || "monthly";

        const now = new Date();
        let startDate = new Date();
        let groupByFormat = "day"; // day | month

        if (range === "weekly") {
            startDate.setDate(now.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);
        } else if (range === "monthly") {
            startDate.setDate(now.getDate() - 29);
            startDate.setHours(0, 0, 0, 0);
        } else if (range === "yearly") {
            startDate = new Date(now.getFullYear(), 0, 1);
            groupByFormat = "month";
        }

        const reports = await prisma.report.findMany({
            where: {
                dinasId: user.dinasId, // Filter by Dinas
                createdAt: {
                    gte: startDate,
                },
            },
            select: {
                createdAt: true,
                status: true,
            },
        });

        const dataMap = new Map<string, { name: string, selesai: number, dalam_proses: number, belum_terjawab: number }>();

        const formatDateKey = (date: Date) => {
            if (groupByFormat === "day") {
                return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
            } else {
                return date.toLocaleDateString("id-ID", { month: "short" });
            }
        };

        if (range === "weekly" || range === "monthly") {
            const tempDate = new Date(startDate);
            while (tempDate <= now) {
                const key = formatDateKey(tempDate);
                dataMap.set(key, { name: key, selesai: 0, dalam_proses: 0, belum_terjawab: 0 });
                tempDate.setDate(tempDate.getDate() + 1);
            }
        } else if (range === "yearly") {
            for (let i = 0; i < 12; i++) {
                const tempDate = new Date(now.getFullYear(), i, 1);
                const key = formatDateKey(tempDate);
                dataMap.set(key, { name: key, selesai: 0, dalam_proses: 0, belum_terjawab: 0 });
            }
        }

        reports.forEach(report => {
            const key = formatDateKey(new Date(report.createdAt));
            if (dataMap.has(key)) {
                const entry = dataMap.get(key)!;
                if (report.status === "SELESAI") {
                    entry.selesai++;
                } else if (report.status === "DIDISPOSISIKAN") {
                    // For Dinas, "DIDISPOSISIKAN" is newly assigned, waiting for action (Belum Terjawab/Verifikasi)
                    entry.belum_terjawab++;
                } else {
                    // Other statuses like "DIVERIFIKASI_DINAS", "DALAM_PENGERJAAN"
                    entry.dalam_proses++;
                }
            }
        });

        const chartData = Array.from(dataMap.values());

        return NextResponse.json({ data: chartData });

    } catch (error) {
        console.error("Fetch dinas chart stats error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mengambil statistik" },
            { status: 500 }
        );
    }
}
