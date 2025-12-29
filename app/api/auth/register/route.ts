// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { registerUser, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, phone } = body;

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Nama, email, dan password harus diisi" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Format email tidak valid" },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password minimal 6 karakter" },
                { status: 400 }
            );
        }

        // Register user
        const user = await registerUser(name, email, password, phone);

        if (!user) {
            return NextResponse.json(
                { error: "Email sudah terdaftar" },
                { status: 409 }
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
            },
        });
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mendaftar" },
            { status: 500 }
        );
    }
}
