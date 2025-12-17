"use client"

import { DataTable, ColumnDef } from "@/components/admin/DataTable"
import { Badge } from "@/components/ui/badge"

const unverifiedReports = [
    {
        id: "7281",
        category: "Jalan Rusak",
        location: "Jl. Merdeka No. 12, Jakarta",
        date: "14/08/2024",
        status: "Belum Diverifikasi",
    },
    {
        id: "7280",
        category: "Pohon Tumbang",
        location: "Jl. Sudirman Koc. 5, Jakarta",
        date: "14/08/2024",
        status: "Belum Diverifikasi",
    },
    {
        id: "7279",
        category: "Lampu Jalan Mati",
        location: "Taman Kota, Bandung",
        date: "13/08/2024",
        status: "Belum Diverifikasi",
    },
    {
        id: "7278",
        category: "Drainase Tersumbat",
        location: "Jl. Diponegoro, Surabaya",
        date: "13/08/2024",
        status: "Belum Diverifikasi",
    },
    {
        id: "7277",
        category: "Jalan Rusak",
        location: "Jl. Gatot Subroto, Medan",
        date: "12/08/2024",
        status: "Belum Diverifikasi",
    },
]

type Report = typeof unverifiedReports[0]

const columns: ColumnDef<Report>[] = [
    {
        key: "id",
        header: "ID Laporan",
        sortable: true,
        cell: (item) => <span className="font-medium">#{item.id}</span>
    },
    {
        key: "date",
        header: "Tanggal",
        sortable: true,
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
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80">
                {item.status}
            </Badge>
        )
    },
]

export default function UnverifiedReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Laporan Belum Diverifikasi</h2>
                <p className="text-muted-foreground">
                    Daftar laporan masuk yang memerlukan tindakan verifikasi.
                </p>
            </div>

            <DataTable
                data={unverifiedReports}
                columns={columns}
                searchKeys={["id", "category", "location"]}
            />
        </div>
    )
}
