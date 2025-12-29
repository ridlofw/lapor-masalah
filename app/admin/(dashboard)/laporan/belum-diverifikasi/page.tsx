"use client"

import { useEffect, useState } from "react"
import { DataTable, ColumnDef } from "@/components/admin/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Loader2 } from "lucide-react"
import Link from "next/link"

interface Report {
    id: string
    category: string
    description: string
    locationText: string
    status: string
    createdAt: string
    reporter: {
        id: string
        name: string
        email: string
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
    if (status === "DITOLAK_DINAS") {
        return (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100/80">
                Dikembalikan Dinas
            </Badge>
        )
    }
    return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80">
            Menunggu Verifikasi
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

export default function UnverifiedReportsPage() {
    const [reports, setReports] = useState<Report[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchReports() {
            try {
                const response = await fetch('/api/admin/reports?section=pending')
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
                    <h2 className="text-2xl font-bold tracking-tight">Laporan Belum Diverifikasi</h2>
                    <p className="text-muted-foreground">
                        Daftar laporan masuk yang memerlukan tindakan verifikasi.
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
                <h2 className="text-2xl font-bold tracking-tight">Laporan Belum Diverifikasi</h2>
                <p className="text-muted-foreground">
                    Daftar laporan masuk yang memerlukan tindakan verifikasi.
                </p>
            </div>

            <DataTable
                data={reports}
                columns={columns}
                searchKeys={["id", "category", "locationText"]}
                renderRowActions={(item) => (
                    <Link href={`/admin/laporan/belum-diverifikasi/${item.id}`} passHref>
                        <Button variant="ghost" size="icon" title="Lihat Detail">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Lihat Detail</span>
                        </Button>
                    </Link>
                )}
            />
        </div>
    )
}
