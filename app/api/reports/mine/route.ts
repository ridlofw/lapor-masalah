// app/api/reports/mine/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Get current user's reports
export async function GET(request: NextRequest) {
    try {
        const session = await getSession("USER");

        if (!session) {
            return NextResponse.json(
                { error: "Anda harus login untuk melihat laporan Anda" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");
        const status = searchParams.get("status");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        // Build where clause
        const where: Record<string, unknown> = {
            userId: session.id,
        };

        // Filter by status if provided
        if (status && status !== "all") {
            if (status === "diproses") {
                where.status = {
                    in: ["DIDISPOSISIKAN", "DIVERIFIKASI_DINAS", "DALAM_PENGERJAAN"]
                };
            } else if (status === "menunggu") {
                where.status = "MENUNGGU_VERIFIKASI";
            } else if (status === "selesai") {
                where.status = "SELESAI";
            } else if (status === "ditolak") {
                where.status = { in: ["DITOLAK", "DITOLAK_DINAS"] };
            } else {
                where.status = status;
            }
        }

        // Filter by search term
        if (search) {
            const searchCondition: any[] = [
                { description: { contains: search, mode: "insensitive" } },
                { locationText: { contains: search, mode: "insensitive" } },
            ];

            // Allow searching by ID roughly
            if (search.length > 5) {
                searchCondition.push({ id: { contains: search } });
            }

            where.OR = searchCondition;
        }

        const [reports, total] = await Promise.all([
            prisma.report.findMany({
                where,
                include: {
                    images: {
                        where: { type: "BUKTI" },
                        take: 1,
                    },
                    dinas: {
                        select: {
                            name: true,
                            type: true,
                        },
                    },
                    _count: {
                        select: {
                            supports: true,
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
            image: report.images[0]?.url || null,
            dinas: report.dinas,
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
        console.error("Get my reports error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mengambil data laporan" },
            { status: 500 }
        );
    }
}
