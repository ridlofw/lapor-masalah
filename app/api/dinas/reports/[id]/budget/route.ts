// app/api/dinas/reports/[id]/budget/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Decimal } from "@prisma/client/runtime/library";

// POST - Set budget for a report
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
        const { budgetTotal } = body;

        if (!budgetTotal || isNaN(Number(budgetTotal)) || Number(budgetTotal) <= 0) {
            return NextResponse.json(
                { error: "Pagu anggaran harus berupa angka positif" },
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

        // Check if report belongs to this dinas
        if (report.dinasId !== session.dinasId) {
            return NextResponse.json(
                { error: "Laporan bukan milik dinas Anda" },
                { status: 403 }
            );
        }

        // Check valid status
        if (report.status !== "DIVERIFIKASI_DINAS" && report.status !== "DALAM_PENGERJAAN") {
            return NextResponse.json(
                { error: "Laporan belum diverifikasi atau sudah selesai" },
                { status: 400 }
            );
        }

        // Format budget
        const formattedBudget = new Decimal(budgetTotal);

        // Update report
        const updatedReport = await prisma.report.update({
            where: { id: reportId },
            data: {
                status: "DALAM_PENGERJAAN",
                budgetTotal: formattedBudget,
                timeline: {
                    create: {
                        actorId: session.id,
                        eventType: "BUDGET_SET",
                        title: "Pagu Anggaran Ditetapkan",
                        description: `Pagu anggaran ditetapkan sebesar Rp ${Number(budgetTotal).toLocaleString("id-ID")}`,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Pagu anggaran berhasil ditetapkan",
            report: {
                id: updatedReport.id,
                status: updatedReport.status,
                budgetTotal: updatedReport.budgetTotal?.toString(),
            },
        });
    } catch (error) {
        console.error("Set budget error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}
