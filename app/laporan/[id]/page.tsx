"use client";

import { useParams } from "next/navigation";
import { reports } from "@/lib/data";
import { ReportInfo } from "@/components/report/ReportInfo";
import { BudgetTransparency } from "@/components/report/BudgetTransparency";
import { ReportTimeline } from "@/components/report/ReportTimeline";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/dashboard/Header";

export default function ReportDetailPage() {
    const params = useParams();
    const id = params.id as string;

    // Find report by ID
    const report = reports.find((r) => r.id === id);

    if (!report) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="container mx-auto px-4 py-8 text-center bg-gray-50 h-screen flex items-center justify-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Laporan Tidak Ditemukan</h1>
                        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Beranda</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link href="/jelajah" className="hover:text-blue-600 transition-colors">Jelajah Laporan</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="font-medium text-gray-800 truncate max-w-[200px] md:max-w-none">{report.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Info & Visual (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        <ReportInfo report={report} />
                        <BudgetTransparency budget={report.budget} />
                    </div>

                    {/* Right Column - Timeline (8 cols) */}
                    <div className="lg:col-span-8">
                        <ReportTimeline timeline={report.timeline} />
                    </div>
                </div>
            </main>
        </div>
    );
}
