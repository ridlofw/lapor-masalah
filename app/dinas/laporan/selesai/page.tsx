"use client"

import { DataTable, ColumnDef } from "@/components/admin/DataTable"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Dummy data for Dinas view - can be shared or fetched
const completedReports = [
    {
        id: "IRG-20231018-001",
        category: "Irigasi",
        location: "Desa Sukatani",
        date: "18 Oct 2023",
        status: "Selesai",
    },
    {
        id: "SKL-20231018-002",
        category: "Sekolah",
        location: "Kecamatan Maju Jaya",
        date: "18 Oct 2023",
        status: "Selesai",
    },
    {
        id: "JLN-20231015-005",
        category: "Jalan Raya",
        location: "Desa Makmur",
        date: "15 Oct 2023",
        status: "Selesai",
    },
    {
        id: "JBT-20231012-003",
        category: "Jembatan",
        location: "Sungai Citarum",
        date: "12 Oct 2023",
        status: "Selesai",
    },
    {
        id: "PAS-20231011-001",
        category: "Pasar",
        location: "Pasar Induk Sejahtera",
        date: "11 Oct 2023",
        status: "Selesai",
    },
    {
        id: "PJU-20231009-004",
        category: "Penerangan Jalan",
        location: "Jl. Pahlawan",
        date: "09 Oct 2023",
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
        cell: (item) => <span className="font-medium">{item.id}</span>
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

export default function DinasCompletedReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Laporan Selesai</h2>
                <p className="text-muted-foreground">
                    Daftar semua laporan yang telah selesai ditangani.
                </p>
            </div>

            <DataTable
                data={completedReports}
                columns={columns}
                searchKeys={["id", "category", "location"]}
                renderRowActions={(item) => (
                    <Link href={`/dinas/laporan/selesai/${item.id}`} passHref>
                        <Button variant="outline" size="sm">
                            Detail
                        </Button>
                    </Link>
                )}
            />
        </div>
    )
}

