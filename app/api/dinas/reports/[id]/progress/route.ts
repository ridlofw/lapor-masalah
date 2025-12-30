// app/api/dinas/reports/[id]/progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Decimal } from "@prisma/client/runtime/library";

// POST - Add progress update
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
        const { description, budgetUsed, images } = body;

        if (!description || description.trim().length === 0) {
            return NextResponse.json(
                { error: "Deskripsi progress harus diisi" },
                { status: 400 }
            );
        }

        if (budgetUsed !== undefined && (isNaN(Number(budgetUsed)) || Number(budgetUsed) < 0)) {
            return NextResponse.json(
                { error: "Anggaran terpakai harus berupa angka tidak negatif" },
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
        if (report.status !== "DALAM_PENGERJAAN") {
            return NextResponse.json(
                { error: "Laporan tidak dalam tahap pengerjaan" },
                { status: 400 }
            );
        }

        const currentBudgetUsed = Number(report.budgetUsed || 0);
        const newBudgetUsed = new Decimal(budgetUsed || 0);
        const totalUsed = new Decimal(currentBudgetUsed).plus(newBudgetUsed);

        // Check if total used exceeds budget
        if (report.budgetTotal && totalUsed.greaterThan(report.budgetTotal)) {
            return NextResponse.json(
                { error: "Total anggaran terpakai melebihi pagu anggaran" },
                { status: 400 }
            );
        }

        // Create progress update
        const progress = await prisma.reportProgress.create({
            data: {
                reportId,
                dinasUserId: session.id,
                description,
                budgetUsed: newBudgetUsed,
                images: images?.length > 0 ? {
                    create: images.map((url: string) => ({ url })),
                } : undefined,
            },
            include: {
                images: true,
            },
        });

        // Update report's total budget used and add timeline
        await prisma.report.update({
            where: { id: reportId },
            data: {
                budgetUsed: totalUsed,
                timeline: {
                    create: {
                        actorId: session.id,
                        eventType: "PROGRESS_UPDATE",
                        title: "Update Progress",
                        description: description,
                        budgetUsed: newBudgetUsed,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Progress berhasil ditambahkan",
            progress: {
                id: progress.id,
                description: progress.description,
                budgetUsed: progress.budgetUsed.toString(),
                images: progress.images.map((img) => img.url),
            },
        });
    } catch (error) {
        console.error("Add progress error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}

// GET - Get all progress updates for a report
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession("DINAS");

        if (!session || session.role !== "DINAS") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: reportId } = await params;

        const progressList = await prisma.reportProgress.findMany({
            where: { reportId },
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
        });

        return NextResponse.json({
            progress: progressList.map((p) => ({
                id: p.id,
                description: p.description,
                budgetUsed: p.budgetUsed.toString(),
                images: p.images.map((img) => img.url),
                createdBy: p.dinasUser,
                createdAt: p.createdAt,
            })),
        });
    } catch (error) {
        console.error("Get progress error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}
