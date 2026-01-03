// app/api/reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ReportCategory, ReportStatus } from "@prisma/client";

// GET - Get all public reports (with filters)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category") as ReportCategory | null;
        const status = searchParams.get("status") as ReportStatus | null;
        const search = searchParams.get("search");
        const sort = searchParams.get("sort") || "latest"; // latest, oldest, support
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        // Build where clause
        const where: Record<string, unknown> = {};

        if (category) {
            where.category = category;
        }

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { description: { contains: search, mode: "insensitive" } },
                { locationText: { contains: search, mode: "insensitive" } },
            ];
        }

        // Build orderBy
        let orderBy: Record<string, string> = { createdAt: "desc" };
        if (sort === "oldest") {
            orderBy = { createdAt: "asc" };
        } else if (sort === "support") {
            // We'll sort after fetching with support count
        }

        // Fetch reports
        const [reports, total] = await Promise.all([
            prisma.report.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
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
                        },
                    },
                },
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.report.count({ where }),
        ]);

        // Transform data
        const transformedReports = reports.map((report) => ({
            id: report.id,
            category: report.category,
            description: report.description,
            locationText: report.locationText,
            latitude: report.latitude,
            longitude: report.longitude,
            status: report.status,
            supportCount: report._count.supports,
            image: report.images[0]?.url || null,
            reporter: {
                id: report.user.id,
                name: report.user.name,
                avatar: report.user.avatar,
            },
            createdAt: report.createdAt,
        }));

        // Sort by support if needed
        if (sort === "support") {
            transformedReports.sort((a, b) => b.supportCount - a.supportCount);
        }

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
        console.error("Get reports error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mengambil data laporan" },
            { status: 500 }
        );
    }
}

// POST - Create a new report
export async function POST(request: NextRequest) {
    try {
        // Try cookie session first (web), then headers (mobile)
        let session = await getSession("USER");

        // If no cookie session, check for mobile app headers
        if (!session) {
            const userId = request.headers.get("X-User-Id");
            const userEmail = request.headers.get("X-User-Email");

            if (userId && userEmail) {
                // Verify user exists in database
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { id: true, name: true, email: true, role: true },
                });

                if (user && user.email === userEmail) {
                    session = user;
                }
            }
        }

        if (!session) {
            return NextResponse.json(
                { error: "Anda harus login untuk membuat laporan" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { category, description, locationText, latitude, longitude, images } = body;

        // Validate required fields
        if (!category || !description || !locationText || latitude === undefined || longitude === undefined) {
            return NextResponse.json(
                { error: "Semua field wajib harus diisi" },
                { status: 400 }
            );
        }

        // Validate category
        const validCategories: ReportCategory[] = ["JALAN", "JEMBATAN", "SEKOLAH", "KESEHATAN", "AIR", "LISTRIK"];
        if (!validCategories.includes(category)) {
            return NextResponse.json(
                { error: "Kategori tidak valid" },
                { status: 400 }
            );
        }

        // Create report with timeline
        const report = await prisma.report.create({
            data: {
                userId: session.id,
                category,
                description,
                locationText,
                latitude,
                longitude,
                status: "MENUNGGU_VERIFIKASI",
                images: images?.length > 0 ? {
                    create: images.map((url: string) => ({
                        url,
                        type: "BUKTI" as const,
                    })),
                } : undefined,
                timeline: {
                    create: {
                        actorId: session.id,
                        eventType: "CREATED",
                        title: "Laporan Dibuat",
                        description: `Laporan berhasil dibuat oleh ${session.name}`,
                    },
                },
            },
            include: {
                images: true,
                timeline: true,
            },
        });

        return NextResponse.json({
            success: true,
            report: {
                id: report.id,
                category: report.category,
                status: report.status,
                createdAt: report.createdAt,
            },
        });
    } catch (error) {
        console.error("Create report error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat membuat laporan" },
            { status: 500 }
        );
    }
}
