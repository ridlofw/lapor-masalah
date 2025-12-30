"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "@/components/admin/StatsCard"
import { FileText, ClipboardList, Activity, CheckCircle2 } from "lucide-react"

interface StatsData {
    total: number
    pending: number
    progress: number
    completed: number
}

export function DinasStats() {
    const [stats, setStats] = useState<StatsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/dinas/stats')
                if (response.ok) {
                    const data = await response.json()
                    setStats(data.stats)
                }
            } catch (error) {
                console.error("Failed to fetch dinas stats:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
                title="Total Laporan Ditugaskan"
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
                title="Dalam Proses"
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
        </div>
    )
}
