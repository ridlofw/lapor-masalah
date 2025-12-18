"use client";

import { ReportCard } from "./ReportCard";

interface Report {
    id: number | string;
    title: string;
    image: string;
    location: string;
    category: string;
    description: string;
    status: "Menunggu Verifikasi" | "Diproses" | "Selesai" | "Ditolak" | "Baru";
    date: string;
    author: {
        name: string;
        avatar: string;
        role: string;
    };
    supportCount: number;
    timeAgo: string;
}

interface ReportsGridProps {
    reports: Report[];
}

export function ReportsGrid({ reports }: ReportsGridProps) {
    if (reports.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500">
                <p>Tidak ada laporan yang ditemukan.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
                <ReportCard
                    key={report.id}
                    {...report}
                />
            ))}
        </div>
    );
}
