// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email dan password harus diisi" },
                { status: 400 }
            );
        }

        // Verify credentials
        const user = await verifyCredentials(email, password);

        if (!user) {
            return NextResponse.json(
                { error: "Email atau password salah" },
                { status: 401 }
            );
        }

        // Create session
        await createSession(user);

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
                dinasId: user.dinasId,
                dinasType: user.dinasType,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat login" },
            { status: 500 }
        );
    }
}
