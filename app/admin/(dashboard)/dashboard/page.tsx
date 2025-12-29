"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "@/components/admin/StatsCard"
import { ReportsChart } from "@/components/admin/ReportsChart"
import { RecentReports } from "@/components/admin/RecentReports"
import { FileText, ClipboardList, Activity, CheckCircle2 } from "lucide-react"

interface StatsData {
    total: number
    pending: number
    progress: number
    completed: number
    rejected: number
}

export default function DashboardPage() {
    const [stats, setStats] = useState<StatsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/admin/stats')
                if (response.ok) {
                    const data = await response.json()
                    setStats(data.stats)
                }
            } catch (error) {
                console.error("Failed to fetch admin stats:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [])

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Pantau statistik dan laporan terbaru di sini.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
                    ))
                ) : (
                    <>
                        <StatsCard
                            title="Total Laporan"
                            value={stats?.total?.toLocaleString('id-ID') || "0"}
                            icon={FileText}
                            trend=""
                            trendUp={true}
                            iconColor="text-gray-500"
                        />
                        <StatsCard
                            title="Belum Diverifikasi"
                            value={stats?.pending?.toLocaleString('id-ID') || "0"}
                            icon={ClipboardList}
                            trend=""
                            trendUp={false}
                            iconColor="text-orange-500"
                        />
                        <StatsCard
                            title="Dalam Progress"
                            value={stats?.progress?.toLocaleString('id-ID') || "0"}
                            icon={Activity}
                            trend=""
                            trendUp={true}
                            iconColor="text-blue-500"
                        />
                        <StatsCard
                            title="Selesai"
                            value={stats?.completed?.toLocaleString('id-ID') || "0"}
                            icon={CheckCircle2}
                            trend=""
                            trendUp={true}
                            iconColor="text-emerald-500"
                        />
                    </>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <ReportsChart />
                <RecentReports />
            </div>
        </div>
    )
}
