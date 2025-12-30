"use client"

import { useEffect, useState } from "react"
import { DataTable, ColumnDef } from "@/components/admin/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Wrench, Loader2 } from "lucide-react"

interface Report {
    id: string
    category: string
    description: string
    locationText: string
    status: string
    createdAt: string
    budget?: {
        total: string
        used: string
    }
    supportCount: number
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

function formatCategory(category: string): string {
    const map: Record<string, string> = {
        JALAN: "Jalan",
        JEMBATAN: "Jembatan",
        SEKOLAH: "Sekolah",
        KESEHATAN: "Kesehatan",
        AIR: "Air",
        LISTRIK: "Listrik",
        PERIZINAN: "Perizinan",
        LAINNYA: "Lainnya",
    }
    return map[category] || category
}

function getStatusBadge(status: string) {
    const statusMap: Record<string, { label: string; className: string }> = {
        DIVERIFIKASI_DINAS: { label: "Diverifikasi", className: "bg-cyan-100 text-cyan-800" },
        DALAM_PENGERJAAN: { label: "Dalam Pengerjaan", className: "bg-blue-100 text-blue-800" },
    }
    const config = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" }
    return (
        <Badge variant="secondary" className={`${config.className} hover:opacity-80`}>
            {config.label}
        </Badge>
    )
}

const columns: ColumnDef<Report>[] = [
    {
        key: "createdAt",
        header: "Tanggal",
        sortable: true,
        cell: (item) => formatDate(item.createdAt),
    },
    {
        key: "id",
        header: "ID Laporan",
        sortable: true,
        cell: (item) => <span className="font-medium">#{item.id.slice(0, 8)}</span>
    },
    {
        key: "category",
        header: "Kategori",
        sortable: true,
        cell: (item) => formatCategory(item.category),
    },
    {
        key: "locationText",
        header: "Lokasi",
        sortable: true,
        cell: (item) => (
            <span className="line-clamp-1 max-w-[200px]" title={item.locationText}>
                {item.locationText}
            </span>
        ),
    },
    {
        key: "supportCount",
        header: "Dukungan",
        sortable: true,
        cell: (item) => (
            <div className="flex items-center gap-1 font-medium text-slate-600">
                <span>{item.supportCount}</span>
            </div>
        ),
    },
    {
        key: "status",
        header: "Status",
        cell: (item) => getStatusBadge(item.status),
    },
]

export default function LaporanProgressPage() {
    const [reports, setReports] = useState<Report[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchReports() {
            try {
                const response = await fetch('/api/dinas/reports?section=progress')
                if (response.ok) {
                    const data = await response.json()
                    setReports(data.reports || [])
                }
            } catch (error) {
                console.error("Failed to fetch reports:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchReports()
    }, [])

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Laporan Dalam Proses</h1>
                    <p className="text-muted-foreground">
                        Daftar laporan yang sedang dalam proses perbaikan.
                    </p>
                </div>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Laporan Dalam Proses</h1>
                <p className="text-muted-foreground">
                    Daftar laporan yang sedang dalam proses perbaikan.
                </p>
            </div>

            <DataTable
                data={reports}
                columns={columns}
                searchKeys={["id", "category", "locationText"]}
                renderRowActions={(item) => (
                    <div className="flex items-center justify-end gap-2 text-sm">
                        <Link href={`/dinas/laporan/progress/${item.id}`} passHref>
                            <Button variant="ghost" size="icon" title="Update Progress">
                                <span className="sr-only">Update Progress</span>
                                <Wrench className="h-4 w-4 text-blue-600" />
                            </Button>
                        </Link>
                    </div>
                )}
            />
        </div>
    )
}
