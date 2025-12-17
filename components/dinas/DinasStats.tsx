"use client"

import { StatsCard } from "@/components/admin/StatsCard"
import { FileText, ClipboardList, Activity, CheckCircle2 } from "lucide-react"

export function DinasStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
                title="Total Laporan Ditugaskan"
                value="320"
                icon={FileText}
                trend="+3.5%"
                trendUp={true}
                iconColor="text-gray-500"
            />
            <StatsCard
                title="Belum Terjawab"
                value="22"
                icon={ClipboardList}
                trend="-2.1%"
                trendUp={false}
                iconColor="text-orange-500"
            />
            <StatsCard
                title="Dalam Proses"
                value="65"
                icon={Activity}
                trend="+8.8%"
                trendUp={true}
                iconColor="text-blue-500"
            />
            <StatsCard
                title="Selesai"
                value="233"
                icon={CheckCircle2}
                trend="+4.7%"
                trendUp={true}
                iconColor="text-emerald-500"
            />
        </div>
    )
}
