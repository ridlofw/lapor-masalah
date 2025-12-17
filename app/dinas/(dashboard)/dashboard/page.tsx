"use client"

import { DinasStats } from "@/components/dinas/DinasStats"
import { DinasReportsChart } from "@/components/dinas/DinasReportsChart"
import { DinasRecentReports } from "@/components/dinas/DinasRecentReports"

export default function DinasDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Dinas</h2>
                <p className="text-muted-foreground">
                    Pantau statistik dan laporan terbaru yang ditugaskan untuk Anda.
                </p>
            </div>

            <DinasStats />

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <DinasReportsChart />
                <DinasRecentReports />
            </div>
        </div>
    )
}
