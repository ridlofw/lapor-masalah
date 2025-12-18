"use client";

import { useState } from "react";

import { Header } from "@/components/dashboard/Header";
import Link from "next/link";
import { FilterBar } from "@/components/jelajah/FilterBar";
import { ReportsGrid } from "@/components/jelajah/ReportsGrid";
import { Pagination } from "@/components/jelajah/Pagination";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function JelajahPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("terbanyak");

    // Mock Data
    const allReports = [
        {
            id: 1,
            title: "Jembatan Gantung Rusak Berat Penghubung Desa",
            image: "https://images.unsplash.com/photo-1546768292-fb12f6c92568?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            location: "Desa Suka Maju, Papua Barat",
            category: "Jembatan",
            description: "Jembatan utama penghubung desa rusak parah akibat banjir.",
            status: "Menunggu Verifikasi" as const,
            date: "2023-10-12",
            author: {
                name: "2 Orang lain",
                avatar: "/avatars/02.png",
                role: "Warga",
            },
            supportCount: 145,
            timeAgo: "2 hari yang lalu"
        },
        {
            id: 2,
            title: "Akses Jalan Utama Terputus Akibat Longsor",
            image: "https://images.unsplash.com/photo-1594738520847-f39b69b5c329?q=80&w=2070&auto=format&fit=crop",
            location: "Kec. Melak, Kutai Barat",
            category: "Jalan",
            description: "Longsor menutup akses jalan utama, mohon bantuan segera.",
            status: "Diproses" as const,
            date: "2023-10-11",
            author: {
                name: "5 orang lain",
                avatar: "/avatars/03.png",
                role: "Warga",
            },
            supportCount: 882,
            timeAgo: "5 jam yang lalu"
        },
        {
            id: 3,
            title: "Atap SD Negeri 02 Bocor Parah, KBM Terganggu",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1932&auto=format&fit=crop",
            location: "Pulau Rote, NTT",
            category: "Sekolah",
            description: "Atap sekolah bocor saat hujan, siswa tidak bisa belajar.",
            status: "Baru" as const,
            date: "2023-10-10",
            author: {
                name: "Baru saja",
                avatar: "/avatars/04.png",
                role: "Guru",
            },
            supportCount: 12,
            timeAgo: "Baru saja"
        },
        {
            id: 4,
            title: "Krisis Air Bersih Akibat Pipa Induk Pecah",
            image: "https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=1974&auto=format&fit=crop",
            location: "Desa Wae Rebo, Flores",
            category: "Air",
            description: "Pipa induk pecah, warga kesulitan air bersih.",
            status: "Menunggu Verifikasi" as const,
            date: "2023-10-09",
            author: {
                name: "1 Minggu yang lalu",
                avatar: "/avatars/05.png",
                role: "Warga",
            },
            supportCount: 340,
            timeAgo: "1 Minggu yang lalu"
        },
        {
            id: 5,
            title: "Tiang Listrik Roboh Menghalangi Jalan",
            image: "https://images.unsplash.com/photo-1496247749665-49cf5bf875d4?q=80&w=2070&auto=format&fit=crop",
            location: "Halmahera Utara, Maluku",
            category: "Listrik",
            description: "Tiang listrik roboh menghalangi jalan dan membahayakan.",
            status: "Selesai" as const,
            date: "2023-10-08",
            author: {
                name: "1 Bulan yang lalu",
                avatar: "/avatars/06.png",
                role: "Warga",
            },
            supportCount: 450,
            timeAgo: "1 Bulan yang lalu"
        },
        {
            id: 6,
            title: "Dinding Puskesmas Pembantu Retak Pasca Gempa",
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop",
            location: "Mentawai, Sumatera Barat",
            category: "Kesehatan",
            description: "Dinding retak parah, takut roboh saat ada gempa susulan.",
            status: "Baru" as const,
            date: "2023-10-07",
            author: {
                name: "3 Jam yang lalu",
                avatar: "/avatars/07.png",
                role: "Nakes",
            },
            supportCount: 45,
            timeAgo: "3 Jam yang lalu"
        },
    ];

    // Filter Logic
    const filteredReports = allReports.filter((report) => {
        const matchesSearch = report.title.toLowerCase().includes(search.toLowerCase()) ||
            report.location.toLowerCase().includes(search.toLowerCase()) ||
            report.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "all" || report.category === category;

        return matchesSearch && matchesCategory;
    });

    // Sort Logic
    const sortedReports = [...filteredReports].sort((a, b) => {
        if (sort === "terbanyak") {
            return b.supportCount - a.supportCount;
        } else if (sort === "terbaru") {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return 0;
    });

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />

            <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
                            Jelajah Laporan Warga
                        </h1>
                        <p className="text-gray-500">
                            Pantau dan dukung perbaikan infrastruktur di daerah 3T.
                        </p>
                    </div>

                    <Link href="/lapor">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-11 px-6 rounded-xl shadow-lg shadow-blue-600/20">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Buat Laporan Baru
                        </Button>
                    </Link>
                </div>

                <FilterBar
                    search={search}
                    setSearch={setSearch}
                    category={category}
                    setCategory={setCategory}
                    sort={sort}
                    setSort={setSort}
                />

                <ReportsGrid reports={sortedReports} />

                <Pagination />
            </main>
        </div>
    );
}
