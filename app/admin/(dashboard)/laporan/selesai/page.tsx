"use client"

import { DataTable, ColumnDef } from "@/components/admin/DataTable"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const completedReports = [
    {
        id: "7290",
        category: "Pohon Tumbang",
        location: "Jl. Mawar, Jakarta",
        date: "10/08/2024",
        status: "Selesai",
    },
    {
        id: "7291",
        category: "Got Mampet",
        location: "Jl. Melati, Jakarta",
        date: "11/08/2024",
        status: "Selesai",
    },
    {
        id: "7292",
        category: "Jalan Berlubang",
        location: "Jl. Kenanga, Jakarta",
        date: "12/08/2024",
        status: "Selesai",
    },
    {
        id: "7293",
        category: "Lampu Taman Mati",
        location: "Taman Mini, Jakarta",
        date: "12/08/2024",
        status: "Ditolak",
    },
    {
        id: "7294",
        category: "Kucing Terjebak",
        location: "Jl. Kakatua, Jakarta",
        date: "13/08/2024",
        status: "Ditolak",
    },
]

type Report = typeof completedReports[0]

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
            <Badge
                variant={item.status === "Selesai" ? "secondary" : "destructive"}
                className={item.status === "Selesai" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80" : ""}
            >
                {item.status}
            </Badge>
        )
    },
]

export default function CompletedReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Laporan Selesai & Ditolak</h2>
                <p className="text-muted-foreground">
                    Daftar laporan yang telah selesai ditangani atau ditolak.
                </p>
            </div>

            <DataTable
                data={completedReports}
                columns={columns}
                searchKeys={["id", "category", "location"]}
                renderRowActions={(item) => (
                    <Link href={`/admin/laporan/selesai/${item.id}`} passHref>
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
