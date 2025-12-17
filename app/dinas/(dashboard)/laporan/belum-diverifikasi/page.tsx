"use client"

import { DataTable, ColumnDef } from "@/components/admin/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Wrench } from "lucide-react"
import Link from "next/link"

const unverifiedReports = [
    {
        id: "12039",
        category: "Jalan Rusak",
        location: "Desa Sukamaju, Kec. Cempaka",
        date: "20 Okt 2023",
        status: "Menunggu Tindak Lanjut",
    },
    {
        id: "12036",
        category: "Jembatan Rusak",
        location: "Sungai Ciliung, Desa Makmur",
        date: "19 Okt 2023",
        status: "Menunggu Tindak Lanjut",
    },
    {
        id: "12037",
        category: "Sekolah Rusak",
        location: "SDN 01 Harapan Bangsa",
        date: "18 Okt 2023",
        status: "Menunggu Tindak Lanjut",
    },
    {
        id: "12038",
        category: "Irigasi Rusak",
        location: "Area Persawahan Desa Tani Jaya",
        date: "18 Okt 2023",
        status: "Menunggu Tindak Lanjut",
    },
    {
        id: "12035",
        category: "Puskesmas Rusak",
        location: "Puskesmas Sehat Selalu, Kec. Damai",
        date: "17 Okt 2023",
        status: "Menunggu Tindak Lanjut",
    },
    {
        id: "12034",
        category: "Jalan Rusak",
        location: "Jalan Utama, Desa Sejahtera",
        date: "16 Okt 2023",
        status: "Menunggu Tindak Lanjut",
    },
]

type Report = typeof unverifiedReports[0]

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

export default function DinasUnverifiedReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Laporan Masuk</h2>
                <p className="text-muted-foreground">
                    Daftar laporan yang perlu ditindaklanjuti oleh dinas.
                </p>
            </div>

            <DataTable
                data={unverifiedReports}
                columns={columns}
                searchKeys={["id", "category", "location"]}
                renderRowActions={(item) => (
                    <Link href={`/dinas/laporan/belum-diverifikasi/${item.id}`} passHref>
                        <Button variant="ghost" size="icon" title="Tindak Lanjuti">
                            <Wrench className="h-4 w-4 text-blue-600" />
                            <span className="sr-only">Tindak Lanjuti</span>
                        </Button>
                    </Link>
                )}
            />
        </div>
    )
}
