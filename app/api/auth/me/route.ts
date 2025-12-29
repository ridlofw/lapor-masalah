// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const roleParam = searchParams.get("role");

        let role: "USER" | "ADMIN" | "DINAS" | undefined = undefined;
        if (roleParam === "ADMIN") role = "ADMIN";
        else if (roleParam === "DINAS") role = "DINAS";
        else if (roleParam === "USER") role = "USER";

        const session = await getSession(role);

        if (!session) {
            return NextResponse.json(
                { error: "Tidak terautentikasi" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            user: {
                id: session.id,
                email: session.email,
                name: session.name,
                role: session.role,
                avatar: session.avatar,
                dinasId: session.dinasId,
                dinasType: session.dinasType,
            },
        });
    } catch (error) {
        console.error("Get session error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}
