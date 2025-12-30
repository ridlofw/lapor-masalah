// app/api/dinas/reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ReportStatus } from "@prisma/client";

// GET - Get reports for current dinas
export async function GET(request: NextRequest) {
    try {
        const session = await getSession("DINAS");

        if (!session || session.role !== "DINAS" || !session.dinasId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const section = searchParams.get("section"); // pending, progress, completed
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search");

        // Build where clause
        const where: Record<string, unknown> = {
            dinasId: session.dinasId,
        };

        // Filter by section
        let statusFilter: ReportStatus[] = [];

        switch (section) {
            case "pending":
                // Belum diverifikasi dinas (baru didisposisikan)
                statusFilter = ["DIDISPOSISIKAN"];
                break;
            case "progress":
                // Sudah diverifikasi dan dalam pengerjaan
                statusFilter = ["DIVERIFIKASI_DINAS", "DALAM_PENGERJAAN"];
                break;
            case "completed":
                // Selesai atau ditolak dinas
                statusFilter = ["SELESAI", "DITOLAK_DINAS"];
                break;
            default:
                // All reports for this dinas
                statusFilter = [];
        }

        if (statusFilter.length > 0) {
            where.status = { in: statusFilter };
        }

        if (search) {
            where.OR = [
                { description: { contains: search, mode: "insensitive" } },
                { locationText: { contains: search, mode: "insensitive" } },
            ];
        }

        const [reports, total] = await Promise.all([
            prisma.report.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true,
                        },
                    },
                    images: {
                        where: { type: "BUKTI" },
                        take: 1,
                    },
                    _count: {
                        select: {
                            supports: true,
                            progress: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.report.count({ where }),
        ]);

        const transformedReports = reports.map((report) => ({
            id: report.id,
            category: report.category,
            description: report.description,
            locationText: report.locationText,
            status: report.status,
            supportCount: report._count.supports,
            progressCount: report._count.progress,
            image: report.images[0]?.url || null,
            reporter: report.user,
            adminNote: report.adminNote,
            dinasNote: report.dinasNote,
            budget: report.budgetTotal ? {
                total: report.budgetTotal.toString(),
                used: report.budgetUsed?.toString() || "0",
            } : null,
            createdAt: report.createdAt,
            updatedAt: report.updatedAt,
        }));

        return NextResponse.json({
            reports: transformedReports,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Dinas get reports error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}
