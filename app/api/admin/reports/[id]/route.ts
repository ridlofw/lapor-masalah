import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession("ADMIN");

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Check if report exists
        const report = await prisma.report.findUnique({
            where: { id },
        });

        if (!report) {
            return NextResponse.json(
                { error: "Laporan tidak ditemukan" },
                { status: 404 }
            );
        }

        // Delete the report
        await prisma.report.delete({
            where: { id },
        });

        return NextResponse.json({
            message: "Laporan berhasil dihapus",
        });
    } catch (error) {
        console.error("Admin delete report error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menghapus laporan" },
            { status: 500 }
        );
    }
}
