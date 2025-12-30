import type { Metadata } from "next"
import { Sidebar } from "@/components/dinas/Sidebar"
import { MobileNav } from "@/components/dinas/MobileNav"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Dinas Dashboard",
    description: "Dinas panel for Lapor Masalah",
}

export default async function DinasLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession("DINAS")

    if (!session) {
        redirect("/dinas/login")
    }

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block fixed inset-y-0 left-0 z-10 w-64 border-r bg-background">
                <Sidebar user={session} />
            </aside>

            {/* Mobile Nav */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center border-b bg-background px-4 h-16">
                <MobileNav user={session} />
                <span className="font-semibold text-lg ml-2">Dinas Dashboard</span>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8">
                {children}
            </main>
        </div>
    )
}
