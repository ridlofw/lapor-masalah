// app/api/admin/reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ReportStatus } from "@prisma/client";

// GET - Get reports for admin (with status filter)
export async function GET(request: NextRequest) {
    try {
        const session = await getSession("ADMIN");

        if (!session || session.role !== "ADMIN") {
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

        // Build where clause based on section
        let statusFilter: ReportStatus[] = [];

        switch (section) {
            case "pending":
                // Belum diverifikasi - includes new and those returned from dinas
                statusFilter = ["MENUNGGU_VERIFIKASI", "DITOLAK_DINAS"];
                break;
            case "progress":
                // In progress - disposed to dinas and being worked on
                statusFilter = ["DIDISPOSISIKAN", "DIVERIFIKASI_DINAS", "DALAM_PENGERJAAN"];
                break;
            case "completed":
                // Completed or rejected
                statusFilter = ["SELESAI", "DITOLAK"];
                break;
            default:
                // All reports
                statusFilter = [];
        }

        const where: Record<string, unknown> = {};

        if (statusFilter.length > 0) {
            where.status = { in: statusFilter };
        }

        if (search) {
            where.OR = [
                { description: { contains: search, mode: "insensitive" } },
                { locationText: { contains: search, mode: "insensitive" } },
                { user: { name: { contains: search, mode: "insensitive" } } },
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
                    dinas: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                        },
                    },
                    images: {
                        where: { type: "BUKTI" },
                        take: 1,
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
            reporter: report.user,
            dinas: report.dinas,
            adminNote: report.adminNote,
            rejectionReason: report.rejectionReason,
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
        console.error("Admin get reports error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}
