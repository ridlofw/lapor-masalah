"use client";

import { ReportCard } from "./ReportCard";

// Mock Data
const reports = [
    {
        id: 1,
        title: "Jembatan Gantung Rusak Berat Penghubung Desa",
        image: "https://images.unsplash.com/photo-1546768292-fb12f6c92568?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        location: "Desa Suka Maju, Papua Barat",
        category: "Infrastruktur",
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
        category: "Bencana Alam",
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
        category: "Pendidikan",
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
        category: "Air Bersih",
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
        supportCount: 0,
        // Note: completed report might not show support count or logic differs, 
        // but preserving prop structure. In screenshot it says "Telah Diperbaiki" in green? 
        // Actually the screenshot shows "Telah Diperbaiki" as text on the right side.
        // I will adjust ReportCard to handle 'Selesai' differently if needed, 
        // but for now let's stick to the card prop structure.
        // Wait, looking closely at the card #5 in screenshot... 
        // It has "Telah Diperbaiki" text instead of support count button.
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

export function ReportsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
                <ReportCard
                    key={report.id}
                    {...report}
                // Special handling for the distinct UI element in card 5 could be props, 
                // For now reusing the standard card which looks very similar.
                // Adjusting the ReportCard component to strictly match the screenshot 
                // might require conditional rendering for the bottom right action.
                />
            ))}
        </div>
    );
}
