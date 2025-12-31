import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getSession("USER");

        if (!session) {
            return NextResponse.json(
                { error: "Anda harus login untuk melihat statistik laporan Anda" },
                { status: 401 }
            );
        }

        const [total, inProgress, completed] = await Promise.all([
            // Total reports by this user
            prisma.report.count({
                where: { userId: session.id }
            }),
            // In Progress: Disposed, Verified by Dinas, or In Progress
            prisma.report.count({
                where: {
                    userId: session.id,
                    status: {
                        in: ["DIDISPOSISIKAN", "DIVERIFIKASI_DINAS", "DALAM_PENGERJAAN"]
                    }
                }
            }),
            // Completed
            prisma.report.count({
                where: {
                    userId: session.id,
                    status: "SELESAI"
                }
            })
        ]);

        return NextResponse.json({
            total,
            inProgress,
            completed
        });
    } catch (error) {
        console.error("Get my stats error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mengambil statistik" },
            { status: 500 }
        );
    }
}
