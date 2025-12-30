import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession("ADMIN");

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const dinas = await prisma.dinas.findMany({
            select: {
                id: true,
                name: true,
                type: true,
            },
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json({ dinas });
    } catch (error) {
        console.error("Fetch dinas error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mengambil data dinas" },
            { status: 500 }
        );
    }
}
