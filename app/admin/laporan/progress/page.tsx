"use client"

import { DataTable, ColumnDef } from "@/components/admin/DataTable"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const progressReports = [
    {
        id: "7285",
        category: "Jalan Rusak",
        location: "Jl. A. Yani, Jakarta",
        date: "14/08/2024",
        status: "Dalam Progress",
    },
    {
        id: "7286",
        category: "Lampu Jalan",
        location: "Jl. Budi Utomo, Jakarta",
        date: "14/08/2024",
        status: "Dalam Progress",
    },
]

type Report = typeof progressReports[0]

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
        cell: (item) => <span className="font-medium">#{item.id}</span>
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
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100/80">
                {item.status}
            </Badge>
        )
    },
]

export default function ProgressReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Laporan Dalam Progress</h2>
                <p className="text-muted-foreground">
                    Daftar laporan yang sedang ditindaklanjuti.
                </p>
            </div>

            <DataTable
                data={progressReports}
                columns={columns}
                searchKeys={["id", "category", "location"]}
                renderRowActions={(item) => (
                    <Link href={`/admin/laporan/progress/${item.id}`} passHref>
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
