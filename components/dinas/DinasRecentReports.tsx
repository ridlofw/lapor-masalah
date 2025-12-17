"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { AlertTriangle, MapPin, School, Droplets } from "lucide-react"

const recentReports = [
    {
        title: "Jalan Rusak di Desa Sukamaju",
        date: "20 Okt 2023",
        status: "Belum Terjawab",
        statusColor: "text-rose-500",
        bgClass: "bg-rose-100/50",
        icon: AlertTriangle,
        iconColor: "text-rose-500",
    },
    {
        title: "Jembatan Gantung Rusak",
        date: "19 Okt 2023",
        status: "Dalam Proses",
        statusColor: "text-amber-500",
        bgClass: "bg-amber-100/50",
        icon: MapPin,
        iconColor: "text-amber-500",
    },
    {
        title: "Perbaikan Atap Sekolah Dasar",
        date: "18 Okt 2023",
        status: "Selesai",
        statusColor: "text-emerald-500",
        bgClass: "bg-emerald-100/50",
        icon: School,
        iconColor: "text-emerald-500",
    },
    {
        title: "Irigasi Sawah Bocor",
        date: "18 Okt 2023",
        status: "Selesai",
        statusColor: "text-emerald-500",
        bgClass: "bg-emerald-100/50",
        icon: Droplets,
        iconColor: "text-emerald-500",
    },
]

export function DinasRecentReports() {
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Laporan Terbaru Ditugaskan</CardTitle>
                <CardDescription>Update status laporan terbaru dari warga.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {recentReports.map((report, index) => (
                        <div key={index} className="flex items-start">
                            <div className={`mr-4 flex h-9 w-9 items-center justify-center rounded-lg ${report.bgClass} sm:h-10 sm:w-10`}>
                                <report.icon className={`h-5 w-5 ${report.iconColor}`} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{report.title}</p>
                                <div className="flex items-center pt-2">
                                    <span className="text-xs text-muted-foreground mr-2">{report.date}</span>
                                    <span className={`text-xs font-medium ${report.statusColor}`}>
                                        {report.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <Link href="/dinas/laporan/belum-diverifikasi" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Lihat semua laporan
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
