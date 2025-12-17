"use client"

import { DataTable, ColumnDef } from "@/components/admin/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Wrench } from "lucide-react"

// Dummy data to match the image
const reports = [
    {
        id: "LP20231005",
        category: "Jembatan",
        location: "Desa Sukamaju",
        date: "20 Okt 2023",
        status: "Peninjauan Lapangan",
        statusColor: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
    },
    {
        id: "LP20231003",
        category: "Irigasi",
        location: "Desa Makmur Jaya",
        date: "18 Okt 2023",
        status: "Pengerjaan Material",
        statusColor: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
    },
    {
        id: "LP20230928",
        category: "Jalan Raya",
        location: "Jl. Merdeka No. 12",
        date: "15 Okt 2023",
        status: "Pengerjaan Fisik",
        statusColor: "bg-purple-100 text-purple-700 hover:bg-purple-100/80",
    },
    {
        id: "LP20230925",
        category: "Gedung Sekolah",
        location: "SDN 01 Harapan Bangsa",
        date: "12 Okt 2023",
        status: "Pengerjaan Fisik",
        statusColor: "bg-purple-100 text-purple-700 hover:bg-purple-100/80",
    },
    {
        id: "LP20230922",
        category: "Listrik",
        location: "Kampung Cahaya",
        date: "10 Okt 2023",
        status: "Peninjauan Lapangan",
        statusColor: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
    },
]

type Report = typeof reports[0]

const columns: ColumnDef<Report>[] = [
    {
        key: "date",
        header: "Tanggal",
        sortable: true,
    },
    {
        key: "id",
        header: "ID Laporan",
        sortable: true,
        cell: (item) => <span className="font-medium">#{item.id.replace('#', '')}</span>
    },
    {
        key: "category",
        header: "Kategori",
        sortable: true,
    },
    {
        key: "location",
        header: "Lokasi",
        sortable: true,
    },
    {
        key: "status",
        header: "Status",
        cell: (item) => (
            <Badge
                variant="secondary"
                className={`rounded-full px-3 py-1 font-normal ${item.statusColor} border-0`}
            >
                {item.status}
            </Badge>
        )
    },
]

export default function LaporanProgressPage() {
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
                searchKeys={["id", "category", "location"]}
                renderRowActions={(item) => (
                    <div className="flex items-center justify-end gap-2 text-sm">
                        <Link href={`/dinas/laporan/progress/${item.id.replace('#', '')}`} passHref>
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
