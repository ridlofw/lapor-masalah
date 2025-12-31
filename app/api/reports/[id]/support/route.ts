// app/api/reports/[id]/support/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// POST - Toggle support for a report
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession("USER");

        if (!session) {
            return NextResponse.json(
                { error: "Anda harus login untuk mendukung laporan" },
                { status: 401 }
            );
        }

        const { id: reportId } = await params;

        // Check if report exists
        const report = await prisma.report.findUnique({
            where: { id: reportId },
        });

        if (!report) {
            return NextResponse.json(
                { error: "Laporan tidak ditemukan" },
                { status: 404 }
            );
        }

        // Check if user already supports this report
        const existingSupport = await prisma.support.findUnique({
            where: {
                userId_reportId: {
                    userId: session.id,
                    reportId,
                },
            },
        });

        if (existingSupport) {
            // Remove support
            await prisma.support.delete({
                where: { id: existingSupport.id },
            });

            const newCount = await prisma.support.count({
                where: { reportId },
            });

            return NextResponse.json({
                success: true,
                supported: false,
                supportCount: newCount,
                message: "Dukungan dibatalkan",
            });
        } else {
            // Add support
            await prisma.support.create({
                data: {
                    userId: session.id,
                    reportId,
                },
            });

            const newCount = await prisma.support.count({
                where: { reportId },
            });

            return NextResponse.json({
                success: true,
                supported: true,
                supportCount: newCount,
                message: "Berhasil mendukung laporan",
            });
        }
    } catch (error) {
        console.error("Support toggle error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}

// GET - Check if current user supports this report
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession("USER");
        const { id: reportId } = await params;

        if (!session) {
            return NextResponse.json({
                supported: false,
                supportCount: await prisma.support.count({ where: { reportId } }),
            });
        }

        const support = await prisma.support.findUnique({
            where: {
                userId_reportId: {
                    userId: session.id,
                    reportId,
                },
            },
        });

        const supportCount = await prisma.support.count({
            where: { reportId },
        });

        return NextResponse.json({
            supported: !!support,
            supportCount,
        });
    } catch (error) {
        console.error("Get support status error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}
