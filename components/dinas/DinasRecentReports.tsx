"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { AlertTriangle, MapPin, School, Droplets, Zap, HeartPulse, Loader2 } from "lucide-react"
import { LucideIcon } from "lucide-react"

interface ReportItem {
    id: string
    category: string
    status: string
    locationText: string
    reporter: string
    createdAt: string
}

// Helper to get icon and colors based on category and status
function getReportDisplay(category: string, status: string): {
    icon: LucideIcon
    iconColor: string
    bgClass: string
    statusColor: string
    statusText: string
} {
    // Status display
    let statusColor = "text-gray-500"
    let statusText = status
    let bgClass = "bg-gray-100/50"

    switch (status) {
        case "DIDISPOSISIKAN":
            statusColor = "text-rose-500"
            statusText = "Belum Diverifikasi"
            bgClass = "bg-rose-100/50"
            break
        case "DIVERIFIKASI_DINAS":
        case "DALAM_PENGERJAAN":
            statusColor = "text-amber-500"
            statusText = "Dalam Proses"
            bgClass = "bg-amber-100/50"
            break
        case "SELESAI":
            statusColor = "text-emerald-500"
            statusText = "Selesai"
            bgClass = "bg-emerald-100/50"
            break
        case "DITOLAK_DINAS":
            statusColor = "text-red-500"
            statusText = "Ditolak"
            bgClass = "bg-red-100/50"
            break
    }

    // Icon based on category
    let icon: LucideIcon = MapPin
    let iconColor = "text-gray-500"

    switch (category) {
        case "JALAN":
        case "JEMBATAN":
            icon = AlertTriangle
            iconColor = statusColor
            break
        case "SEKOLAH":
            icon = School
            iconColor = statusColor
            break
        case "KESEHATAN":
            icon = HeartPulse
            iconColor = statusColor
            break
        case "AIR":
            icon = Droplets
            iconColor = statusColor
            break
        case "LISTRIK":
            icon = Zap
            iconColor = statusColor
            break
    }

    return { icon, iconColor, bgClass, statusColor, statusText }
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

export function DinasRecentReports() {
    const [reports, setReports] = useState<ReportItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchReports() {
            try {
                const response = await fetch('/api/dinas/stats')
                if (response.ok) {
                    const data = await response.json()
                    setReports(data.recentReports || [])
                }
            } catch (error) {
                console.error("Failed to fetch recent reports:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchReports()
    }, [])

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Laporan Terbaru Ditugaskan</CardTitle>
                <CardDescription>Update status laporan terbaru dari warga.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        Belum ada laporan ditugaskan
                    </div>
                ) : (
                    <div className="space-y-8">
                        {reports.map((report) => {
                            const display = getReportDisplay(report.category, report.status)
                            const Icon = display.icon
                            return (
                                <div key={report.id} className="flex items-start">
                                    <div className={`mr-4 flex h-9 w-9 items-center justify-center rounded-lg ${display.bgClass} sm:h-10 sm:w-10`}>
                                        <Icon className={`h-5 w-5 ${display.iconColor}`} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none line-clamp-1">
                                            {report.locationText}
                                        </p>
                                        <div className="flex items-center pt-2">
                                            <span className="text-xs text-muted-foreground mr-2">
                                                {formatDate(report.createdAt)}
                                            </span>
                                            <span className={`text-xs font-medium ${display.statusColor}`}>
                                                {display.statusText}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
                <div className="mt-6">
                    <Link href="/dinas/laporan/belum-diverifikasi" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Lihat semua laporan
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
