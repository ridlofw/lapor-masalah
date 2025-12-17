import type { Metadata } from "next"
import { Sidebar } from "@/components/admin/Sidebar"
import { MobileNav } from "@/components/admin/MobileNav"

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description: "Admin panel for Lapor Masalah",
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block fixed inset-y-0 left-0 z-10 w-64 border-r bg-background">
                <Sidebar />
            </aside>

            {/* Mobile Nav */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center border-b bg-background px-4 h-16">
                <MobileNav />
                <span className="font-semibold text-lg ml-2">Admin Dashboard</span>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8">
                {children}
            </main>
        </div>
    )
}
