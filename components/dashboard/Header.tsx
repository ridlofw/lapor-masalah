
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Compass, FileText, LayoutDashboard, LogOut, Menu, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";

export function Header() {
    const { user, logout, isLoading } = useAuth();
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

                            {user ? (
                                <div className="p-4 border-t bg-gray-50/30">
                                    <div className="flex items-center gap-3 px-2 mb-4">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-gray-100">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 font-bold">
                                                {user.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-bold text-[#1e293b]">{user.name}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 justify-start gap-3 h-11 font-medium"
                                        onClick={logout}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Keluar Aplikasi
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-4 border-t bg-gray-50/30 grid gap-3">
                                    <Link href="/login" className="w-full">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Masuk</Button>
                                    </Link>
                                    <Link href="/signup" className="w-full">
                                        <Button variant="outline" className="w-full">Daftar</Button>
                                    </Link>
                                </div>
                            )}
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
                    {isLoading ? (
                        <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full" />
                    ) : user ? (
                        <>


                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="p-0 hover:bg-transparent flex items-center gap-3 pl-2 sm:pl-4 border-l-0 sm:border-l border-gray-200 h-auto rounded-none">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-semibold text-[#1e293b]">{user.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-gray-100 shadow-sm">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="bg-orange-100 text-orange-600 font-bold text-xs sm:text-sm">
                                                {user.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Keluar Aplikasi</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Link href="/login" className="hidden sm:block">
                                <Button variant="ghost" className="text-gray-600 hover:text-blue-600">Masuk</Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200">
                                    Daftar
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
