"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, FileText, Settings, LogOut, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SimpleAlertDialog } from "@/components/ui/simple-alert-dialog"

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname()
    const router = useRouter()
    const [isLaporanOpen, setIsLaporanOpen] = useState(pathname.startsWith("/admin/laporan"))
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout?role=ADMIN", {
                method: "POST",
            })
            router.push("/admin/login")
            router.refresh()
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    return (
        <div className={cn("flex h-full flex-col bg-sidebar text-sidebar-foreground", className)}>
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="/avatars/01.png" alt="@admin" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Admin Lapor Masalah</span>
                        <span className="text-xs text-muted-foreground">admin@lapormasalah.go.id</span>
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    <Link
                        href="/admin/dashboard"
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            pathname === "/admin/dashboard" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"
                        )}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>

                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => setIsLaporanOpen(!isLaporanOpen)}
                            className={cn(
                                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                                isLaporanOpen || pathname.startsWith("/admin/laporan") ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4" />
                                Laporan
                            </div>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    isLaporanOpen ? "rotate-180" : ""
                                )}
                            />
                        </button>

                        {isLaporanOpen && (
                            <div className="ml-9 flex flex-col gap-1 border-l pl-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                <Link
                                    href="/admin/laporan/belum-diverifikasi"
                                    className={cn(
                                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                                        pathname === "/admin/laporan/belum-diverifikasi" ? "text-primary bg-primary/10" : "text-muted-foreground"
                                    )}
                                >
                                    Belum Diverifikasi
                                </Link>
                                <Link
                                    href="/admin/laporan/progress"
                                    className={cn(
                                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                                        pathname === "/admin/laporan/progress" ? "text-primary bg-primary/10" : "text-muted-foreground"
                                    )}
                                >
                                    Laporan Progress
                                </Link>
                                <Link
                                    href="/admin/laporan/selesai"
                                    className={cn(
                                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                                        pathname === "/admin/laporan/selesai" ? "text-primary bg-primary/10" : "text-muted-foreground"
                                    )}
                                >
                                    Laporan Selesai
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
            <div className="mt-auto p-6 flex flex-col gap-2">
                <Link
                    href="/admin/pengaturan"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                    <Settings className="h-4 w-4" />
                    Pengaturan
                </Link>
                <button
                    onClick={() => setShowLogoutDialog(true)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>

            <SimpleAlertDialog
                open={showLogoutDialog}
                onOpenChange={setShowLogoutDialog}
                title="Apakah Anda yakin?"
                description="Anda akan keluar dari sesi admin saat ini. Anda perlu login kembali untuk mengakses halaman ini."
                cancelText="Batal"
                confirmText="Keluar"
                onConfirm={handleLogout}
                variant="destructive"
            />
        </div>
    )
}
