import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { router } from "expo-router";
import { api, User } from "@/services/api";
import { storage } from "@/utils/storage";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStoredUser();
    }, []);

    const loadStoredUser = async () => {
        try {
            const storedUser = await storage.getUser();
            const token = await storage.getToken();

            if (storedUser && token) {
                setUser(storedUser);
            }
        } catch (error) {
            console.error("Error loading stored user:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await api.login(email, password);

        if (response.success && response.user) {
            setUser(response.user);
            await storage.saveUser(response.user);
            // Generate a simple token for API calls
            await storage.saveToken(`${response.user.id}-${Date.now()}`);
        } else {
            throw new Error(response.error || "Login gagal");
        }
    };

    const register = async (name: string, email: string, password: string, phone?: string) => {
        const response = await api.register(name, email, password, phone);

        if (response.success && response.user) {
            setUser(response.user);
            await storage.saveUser(response.user);
            await storage.saveToken(`${response.user.id}-${Date.now()}`);
        } else {
            throw new Error(response.error || "Registrasi gagal");
        }
    };

    const logout = async () => {
        try {
            await storage.clearAll();
            setUser(null);
            // Navigate to login screen
            router.replace("/(auth)/login");
        } catch (error) {
            console.error("Error during logout:", error);
            // Still clear user and navigate even if storage clear fails
            setUser(null);
            router.replace("/(auth)/login");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
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
