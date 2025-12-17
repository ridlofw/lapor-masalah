import { StatsCard } from "@/components/admin/StatsCard"
import { ReportsChart } from "@/components/admin/ReportsChart"
import { RecentReports } from "@/components/admin/RecentReports"
import { FileText, ClipboardList, Activity, CheckCircle2 } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Pantau statistik dan laporan terbaru di sini.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Laporan"
                    value="1,240"
                    icon={FileText}
                    trend="+15.2%"
                    trendUp={true}
                    iconColor="text-gray-500"
                />
                <StatsCard
                    title="Belum Diverifikasi"
                    value="45"
                    icon={ClipboardList}
                    trend="-1.8%"
                    trendUp={false}
                    iconColor="text-orange-500"
                />
                <StatsCard
                    title="Dalam Progress"
                    value="120"
                    icon={Activity}
                    trend="+12.5%"
                    trendUp={true}
                    iconColor="text-blue-500"
                />
                <StatsCard
                    title="Selesai"
                    value="850"
                    icon={CheckCircle2}
                    trend="+5.1%"
                    trendUp={true}
                    iconColor="text-emerald-500"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <ReportsChart />
                <RecentReports />
            </div>
        </div>
    )
}
