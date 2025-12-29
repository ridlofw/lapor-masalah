"use client";

import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ReportCard } from "@/components/jelajah/ReportCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useCountUp } from "@/hooks/useCountUp";

const StatsCounter = () => {
    const totalReports = useCountUp(1200);
    const resolvedReports = useCountUp(850);
    const inProgressReports = useCountUp(150);
    const responseTime = useCountUp(24);

    return (
        <>
            <div>
                <div className="text-3xl font-bold text-[#1e293b] mb-1">{totalReports}+</div>
                <div className="text-sm text-gray-500">Total Laporan</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-green-600 mb-1">{resolvedReports}+</div>
                <div className="text-sm text-gray-500">Selesai Diperbaiki</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">{inProgressReports}+</div>
                <div className="text-sm text-gray-500">Sedang Diproses</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-yellow-600 mb-1">{responseTime}h</div>
                <div className="text-sm text-gray-500">Rata-rata Respon</div>
            </div>
        </>
    );
};

export default function LandingPage() {
    const [stats, setStats] = useState({
        total: 0,
        resolved: 0,
        inProgress: 0
    });
    const [recentReports, setRecentReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Reports
                const reportsRes = await fetch('/api/reports?limit=3');
                const reportsData = await reportsRes.json();

                // Fetch Stats (We might need a dedicated public stats endpoint, but for now we can infer or use what we have)
                // Since we don't have a public stats endpoint yet, we'll try to get it from a general stats endpoint or calc from reports
                // For now, let's use the reports data to ideally populate this, or fetch a larger list
                // MODIFY: Assuming we create a simple stats endpoint or just show what we have. 
                // Let's rely on /api/reports/stats if it exists (it was created for admin/dashboard but maybe we can reuse or create public one)
                // Actually, let's just use hardcoded/calculated stats for now or mock them until we verify an endpoint.
                // Wait, I saw /api/admin/stats. Let's try to fetch that if public? No, middleware protects it.
                // WE NEED A PUBLIC STATS ENDPOINT.
                // For this step, I will calculate from the recent reports response if possible (metadata?) or just show placeholders until next step.
                // Better: Fetch a few reports and at least show those.

                if (reportsData.reports) {
                    const mappedReports = reportsData.reports.slice(0, 3).map((r: any) => ({
                        id: r.id,
                        title: r.description,
                        image: (r.image && r.image !== "https://images.unsplash.com/photo-1546768292-fb12f6c92568?q=80&w=1350") ? r.image : "/images/no-image-placeholder.png",
                        location: r.locationText,
                        category: r.category,
                        description: r.description,
                        status: mapStatus(r.status),
                        date: new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                        author: {
                            name: r.reporter.name,
                            avatar: r.reporter.avatar || "",
                            role: "Warga"
                        },
                        supportCount: r.supportCount,
                        timeAgo: getTimeAgo(new Date(r.createdAt))
                    }));
                    setRecentReports(mappedReports);
                }

            } catch (error) {
                console.error("Failed to fetch landing data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const mapStatus = (status: string) => {
        switch (status) {
            case "SELESAI": return "Selesai";
            case "MENUNGGU_VERIFIKASI": return "Menunggu Verifikasi";
            case "DIPROSES":
            case "TINDAK_LANJUT": return "Diproses";
            case "DITOLAK": return "Ditolak";
            default: return "Baru";
        }
    }

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " tahun lalu";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " bulan lalu";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " hari lalu";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " jam lalu";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " menit lalu";
        return Math.floor(seconds) + " detik lalu";
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517036785168-d0d619cfc3eb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03]" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6 border border-blue-200">
                        Platform Pelaporan Masalah Publik
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-[#1e293b]">
                        Laporkan Masalah,<br />
                        <span className="text-blue-600">Bangun Perubahan</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
                        Sampaikan aspirasi dan laporan masalah infrastruktur di lingkungan Anda.
                        Kami pastikan setiap laporan didengar dan ditindaklanjuti.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/lapor">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-base shadow-lg shadow-blue-600/20">
                                Buat Laporan Sekarang
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                        <Link href="/jelajah">
                            <Button size="lg" variant="outline" className="bg-white hover:bg-white/50 text-gray-700 border-gray-200 h-12 px-8 text-base">
                                Lihat Laporan Warga
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20 pt-10 border-t border-blue-200/60">
                        <StatsCounter />
                    </div>
                </div>
            </section>

            {/* Recent Reports Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-[#1e293b] mb-4">Laporan Terbaru</h2>
                            <p className="text-gray-500 max-w-lg">
                                Pantau laporan terkini dari warga di berbagai wilayah.
                            </p>
                        </div>
                        <Link href="/jelajah">
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                Lihat Semua
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="h-96 w-full animate-pulse bg-gray-200 border-none" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recentReports.map((report: any) => (
                                <ReportCard key={report.id} {...report} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-[#1e293b] mb-4">Bagaimana Cara Kerjanya?</h2>
                        <p className="text-gray-500">
                            Proses pelaporan yang transparan dan mudah dipantau langsung dari gadget Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                                <Clock className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1e293b]">1. Lapor Masalah</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Foto kerusakan, isi deskripsi singkat, dan kirim laporan Anda dalam hitungan menit.
                            </p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1e293b]">2. Verifikasi & Proses</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Laporan diverifikasi oleh dinas terkait dan langsung dijadwalkan untuk perbaikan.
                            </p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1e293b]">3. Selesai</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Pantau progress pengerjaan hingga masalah selesai diperbaiki.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
