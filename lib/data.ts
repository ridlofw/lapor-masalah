import { Droplets, Lightbulb, Pickaxe, LucideIcon } from "lucide-react";

export interface TimelineItem {
    date: string;
    title: string;
    description: string;
    images?: string[];
    budgetUsed?: string;
    status: "completed" | "in_progress" | "pending";
}

export interface Report {
    id: string;
    title: string;
    category: string;
    date: string;
    location: string;
    fullAddress: string;
    status: "Diproses" | "Menunggu" | "Selesai";
    statusColor: string;
    icon: LucideIcon;
    description: string;
    image: string; // URL to the main image
    supportCount: number;
    timeline: TimelineItem[];
    budget: {
        total: string;
        used: string;
        percentage: number;
    };
}

export const reports: Report[] = [
    {
        id: "1",
        title: "Jalan Rusak di Depan Balai Desa Ciptagelar",
        category: "Infrastruktur Jalan",
        date: "12 Okt 2023",
        location: "Desa Sukamaju, RW 05",
        fullAddress: "Desa Ciptagelar, Kab. Sukabumi",
        status: "Diproses",
        statusColor: "bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-100",
        icon: Pickaxe,
        description: "Jalan rusak parah berlubang besar yang membahayakan pengendara motor, terutama saat hujan.",
        image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop",
        supportCount: 342,
        budget: {
            total: "Rp 50.000.000",
            used: "Rp 25.500.000",
            percentage: 51,
        },
        timeline: [
            {
                date: "21 Agustus 2024, 14:00",
                title: "Dinas Memperbarui Progress",
                description: "Tim dari Dinas Pekerjaan Umum telah memulai perbaikan awal. Material telah diturunkan di lokasi dan sebagian lubang besar sudah mulai ditambal.",
                images: [
                    "https://images.unsplash.com/photo-1584463673574-896131336423?q=80&w=2069&auto=format&fit=crop",
                    "https://plus.unsplash.com/premium_photo-1663045625458-385075677d24?q=80&w=2070&auto=format&fit=crop"
                ],
                budgetUsed: "Rp 25.500.000 telah digunakan untuk pembelian material awal.",
                status: "in_progress"
            },
            {
                date: "18 Agustus 2024, 10:00",
                title: "Dinas Melakukan Verifikasi",
                description: "Tim survei dari Dinas PU telah meninjau lokasi, mengukur tingkat kerusakan, dan menyetujui alokasi anggaran untuk perbaikan.",
                status: "completed"
            },
            {
                date: "15 Agustus 2024, 11:45",
                title: "Diteruskan ke Dinas Pekerjaan Umum",
                description: "Laporan telah didisposisikan ke dinas terkait yang bertanggung jawab atas infrastruktur jalan.",
                status: "completed"
            },
            {
                date: "14 Agustus 2024, 15:30",
                title: "Laporan Diverifikasi oleh Admin",
                description: "Admin telah memeriksa kelengkapan dan keabsahan laporan. Laporan valid dan siap diteruskan.",
                status: "completed"
            },
            {
                date: "14 Agustus 2024, 09:15",
                title: "Laporan Dibuat",
                description: "Laporan dibuat oleh pengguna dan masuk ke dalam sistem.",
                status: "completed"
            }
        ]
    },
    {
        id: "2",
        title: "Saluran Air Mampet Menyebabkan Banjir",
        category: "Saluran Air Mampet",
        date: "10 Okt 2023",
        location: "Pasar Lama, Blok C",
        fullAddress: "Pasar Lama, Blok C, Kota Bogor",
        status: "Menunggu",
        statusColor: "bg-orange-50 text-orange-600 hover:bg-orange-50 border-orange-100",
        icon: Droplets,
        description: "Saluran air tersumbat sampah plastik sehingga air meluap ke jalan saat hujan deras.",
        image: "https://images.unsplash.com/photo-1546955121-d70377ee7d52?q=80&w=1954&auto=format&fit=crop",
        supportCount: 125,
        budget: {
            total: "Rp 15.000.000",
            used: "Rp 0",
            percentage: 0,
        },
        timeline: [
            {
                date: "10 Okt 2023, 08:00",
                title: "Laporan Dibuat",
                description: "Laporan dibuat oleh pengguna.",
                status: "completed"
            }
        ]
    },
    {
        id: "3",
        title: "Lampu Jalan Mati di Perempatan",
        category: "Lampu Jalan Mati",
        date: "05 Okt 2023",
        location: "Jl. Merdeka No. 45",
        fullAddress: "Jl. Merdeka No. 45, Bandung",
        status: "Selesai",
        statusColor: "bg-green-50 text-green-600 hover:bg-green-50 border-green-100",
        icon: Lightbulb,
        description: "Lampu penerangan jalan umum mati total, kondisi gelap gulita rawan kecelakaan.",
        image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop",
        supportCount: 56,
        budget: {
            total: "Rp 2.000.000",
            used: "Rp 2.000.000",
            percentage: 100,
        },
        timeline: [
            {
                date: "07 Okt 2023, 16:00",
                title: "Perbaikan Selesai",
                description: "Lampu telah diganti dan berfungsi kembali.",
                status: "completed"
            }
        ]
    },
];
