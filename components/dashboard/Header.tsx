"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Compass, FileText, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Header() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <header className="border-b bg-white sticky top-0 z-50">
            <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-gray-500 hover:bg-gray-100">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[85%] sm:w-[350px] p-0 flex flex-col">
                            <SheetHeader className="p-6 border-b bg-gray-50/50">
                                <SheetTitle className="text-left font-bold text-[#1e293b] flex items-center gap-3">
                                    <div className="bg-[#1e293b] text-white p-2 rounded-lg shadow-sm">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="m3 11 18-5v12L3 14v-3z" />
                                            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-xl block leading-none">Lapor</span>
                                        <span className="text-sm font-normal text-muted-foreground">Masalah</span>
                                    </div>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex-1 flex flex-col gap-2 p-4">
                                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                    Menu Utama
                                </div>
                                <Link
                                    href="/"
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-sm border border-transparent",
                                        isActive("/dashboard") || isActive("/")
                                            ? "bg-blue-50 text-blue-700 border-blue-100/50 shadow-sm"
                                            : "text-gray-600 hover:text-[#1e293b] hover:bg-gray-50"
                                    )}
                                >
                                    <LayoutDashboard className={cn("h-5 w-5", isActive("/dashboard") || isActive("/") ? "text-blue-600" : "text-gray-400")} />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/laporan-saya"
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-sm border border-transparent",
                                        isActive("/laporan-saya")
                                            ? "bg-blue-50 text-blue-700 border-blue-100/50 shadow-sm"
                                            : "text-gray-600 hover:text-[#1e293b] hover:bg-gray-50"
                                    )}
                                >
                                    <FileText className={cn("h-5 w-5", isActive("/laporan-saya") ? "text-blue-600" : "text-gray-400")} />
                                    Laporan Saya
                                </Link>
                                <Link
                                    href="/jelajah"
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-sm border border-transparent",
                                        isActive("/jelajah")
                                            ? "bg-blue-50 text-blue-700 border-blue-100/50 shadow-sm"
                                            : "text-gray-600 hover:text-[#1e293b] hover:bg-gray-50"
                                    )}
                                >
                                    <Compass className={cn("h-5 w-5", isActive("/jelajah") ? "text-blue-600" : "text-gray-400")} />
                                    Jelajah Laporan
                                </Link>
                            </div>

                            <div className="p-4 border-t bg-gray-50/30">
                                <div className="flex items-center gap-3 px-2 mb-4">
                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-gray-100">
                                        <AvatarImage src="/avatars/01.png" alt="Budi Santoso" />
                                        <AvatarFallback className="bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 font-bold">BS</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-bold text-[#1e293b]">Budi Santoso</p>
                                        <p className="text-xs text-muted-foreground">Masyarakat</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 justify-start gap-3 h-11 font-medium">
                                    <LogOut className="h-4 w-4" />
                                    Keluar Aplikasi
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="bg-[#1e293b] text-white p-1 rounded-md hidden md:block">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-megaphone"
                            >
                                <path d="m3 11 18-5v12L3 14v-3z" />
                                <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                            </svg>
                        </div>
                        <span className="font-semibold text-lg text-[#1e293b]">Lapor Masalah</span>
                    </div>
                </div>

                {/* Navigation - Desktop */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
                    <Link
                        href="/"
                        className={cn(
                            "px-3 py-1.5 rounded-md transition-colors",
                            isActive("/dashboard") || isActive("/")
                                ? "text-[#1e293b] bg-gray-100"
                                : "hover:text-[#1e293b]"
                        )}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/laporan-saya"
                        className={cn(
                            "px-3 py-1.5 rounded-md transition-colors",
                            isActive("/laporan-saya")
                                ? "text-[#1e293b] bg-gray-100"
                                : "hover:text-[#1e293b]"
                        )}
                    >
                        Laporan Saya
                    </Link>
                    <Link
                        href="/jelajah"
                        className={cn(
                            "px-3 py-1.5 rounded-md transition-colors",
                            isActive("/jelajah")
                                ? "text-[#1e293b] bg-gray-100"
                                : "hover:text-[#1e293b]"
                        )}
                    >
                        Jelajah Laporan
                    </Link>
                </nav>

                {/* User Profile */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-gray-600">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </Button>

                    <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-200">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-[#1e293b]">Budi Santoso</p>
                            <p className="text-xs text-gray-500">Masyarakat</p>
                        </div>
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                            <AvatarImage src="/avatars/01.png" alt="Budi Santoso" />
                            <AvatarFallback className="bg-orange-100 text-orange-600 font-bold text-xs sm:text-sm">BS</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </header>
    );
}
