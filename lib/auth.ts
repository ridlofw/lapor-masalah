// lib/auth.ts
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export interface SessionUser {
    id: string;
    email: string;
    name: string;
    role: "USER" | "ADMIN" | "DINAS";
    avatar?: string;
    dinasId?: string;
    dinasType?: string;
}

// Session cookie names based on role
const SESSION_COOKIES = {
    USER: "user_session",
    ADMIN: "admin_session",
    DINAS: "dinas_session",
} as const;

// Cookie options
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
};

export async function createSession(user: SessionUser): Promise<void> {
    const cookieStore = await cookies();
    const sessionData = JSON.stringify(user);

    // Set the appropriate cookie based on role
    const cookieName = SESSION_COOKIES[user.role];
    cookieStore.set(cookieName, sessionData, COOKIE_OPTIONS);
}

export async function getSession(role?: "USER" | "ADMIN" | "DINAS"): Promise<SessionUser | null> {
    const cookieStore = await cookies();

    // If role specified, check that specific cookie
    if (role) {
        const cookieName = SESSION_COOKIES[role];
        const sessionCookie = cookieStore.get(cookieName);
        if (sessionCookie) {
            try {
                return JSON.parse(sessionCookie.value);
            } catch {
                return null;
            }
        }
        return null;
    }

    // Otherwise, check all session cookies
    // Note: This might return *any* active session if multiple are present.
    // Callers should ideally specify role if they know context.
    for (const [, cookieName] of Object.entries(SESSION_COOKIES)) {
        const sessionCookie = cookieStore.get(cookieName);
        if (sessionCookie) {
            try {
                return JSON.parse(sessionCookie.value);
            } catch {
                continue;
            }
        }
    }

    return null;
}

export async function destroySession(role: "USER" | "ADMIN" | "DINAS"): Promise<void> {
    const cookieStore = await cookies();
    const cookieName = SESSION_COOKIES[role];

    cookieStore.delete(cookieName);
}

export async function verifyCredentials(
    email: string,
    password: string
): Promise<SessionUser | null> {
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            dinas: true,
        },
    });

    if (!user) {
        return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar || undefined,
        dinasId: user.dinasId || undefined,
        dinasType: user.dinas?.type || undefined,
    };
}

export async function registerUser(
    name: string,
    email: string,
    password: string,
    phone?: string
): Promise<SessionUser | null> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return null;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            phone,
            role: "USER",
        },
    });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar || undefined,
    };
}
