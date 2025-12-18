"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    name: string;
    email: string;
    role: "user" | "admin" | "dinas";
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, role?: "user" | "admin" | "dinas") => void;
    logout: () => void;
    signup: (name: string, email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for existing session
        const storedUser = localStorage.getItem("user_session");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user session", e);
                localStorage.removeItem("user_session");
            }
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, role: "user" | "admin" | "dinas" = "user") => {
        setIsLoading(true);
        // Mock user data
        const newUser: User = {
            name: email.split("@")[0] || "User",
            email: email,
            role: role,
            avatar: "/avatars/01.png"
        };

        localStorage.setItem("user_session", JSON.stringify(newUser));
        setUser(newUser);
        setIsLoading(false);
    };

    const signup = (name: string, email: string) => {
        setIsLoading(true);
        const newUser: User = {
            name: name,
            email: email,
            role: "user",
            avatar: "/avatars/01.png"
        };

        localStorage.setItem("user_session", JSON.stringify(newUser));
        setUser(newUser);
        setIsLoading(false);
    };

    const logout = () => {
        localStorage.removeItem("user_session");
        setUser(null);
        router.push("/login");
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, signup }}>
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
