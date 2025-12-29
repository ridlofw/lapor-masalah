// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { destroySession, getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        // Check if we have query param for role, otherwise detect from session
        const { searchParams } = new URL(request.url);
        const roleParam = searchParams.get("role")?.toUpperCase() as "USER" | "ADMIN" | "DINAS" | undefined;

        // Get current session to determine role if not provided
        const session = await getSession();
        const role = roleParam || session?.role || "USER";

        // Destroy session
        await destroySession(role);

        return NextResponse.json({
            success: true,
            message: "Logout berhasil",
        });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat logout" },
            { status: 500 }
        );
    }
}
