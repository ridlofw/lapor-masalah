"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "DINAS";
    avatar?: string;
    dinasId?: string;
    dinasType?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string, redirectTo?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    signup: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check for existing session on mount
    const checkSession = useCallback(async () => {
        try {
            // Determine the expected role based on the current path
            const path = window.location.pathname;
            let roleParam = "USER";

            if (path.startsWith("/admin")) {
                roleParam = "ADMIN";
            } else if (path.startsWith("/dinas")) {
                roleParam = "DINAS";
            }

            // Always fetch verification from API
            const response = await fetch(`/api/auth/me?role=${roleParam}`);

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (e) {
            console.error("Failed to check session", e);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const refreshUser = async () => {
        await checkSession();
    };

    const login = async (email: string, password: string, redirectTo?: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setIsLoading(false);
                return { success: false, error: data.error || 'Login gagal' };
            }

            setUser(data.user);
            setIsLoading(false);

            // Redirect based on role
            if (redirectTo) {
                router.push(redirectTo);
            } else {
                switch (data.user.role) {
                    case "ADMIN":
                        router.push("/admin/dashboard");
                        break;
                    case "DINAS":
                        router.push("/dinas/dashboard");
                        break;
                    default:
                        router.push("/");
                }
            }

            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            setIsLoading(false);
            return { success: false, error: 'Terjadi kesalahan saat login' };
        }
    };

    const signup = async (name: string, email: string, password: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, phone }),
            });

            const data = await response.json();

            if (!response.ok) {
                setIsLoading(false);
                return { success: false, error: data.error || 'Registrasi gagal' };
            }

            setUser(data.user);
            setIsLoading(false);
            router.push("/");

            return { success: true };
        } catch (error) {
            console.error("Signup error:", error);
            setIsLoading(false);
            return { success: false, error: 'Terjadi kesalahan saat mendaftar' };
        }
    };

    const logout = async () => {
        try {
            const role = user?.role || "USER";
            await fetch(`/api/auth/logout?role=${role}`, {
                method: 'POST',
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);

            // Redirect based on previous role
            const prevRole = user?.role;
            if (prevRole === "ADMIN") {
                router.push("/admin/login");
            } else if (prevRole === "DINAS") {
                router.push("/dinas/login");
            } else {
                router.push("/login");
            }
            router.refresh();
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, signup, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
