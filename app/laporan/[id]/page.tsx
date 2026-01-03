"use client";

import { useParams, useRouter } from "next/navigation";
import { ReportInfo } from "@/components/report/ReportInfo";
import { BudgetTransparency } from "@/components/report/BudgetTransparency";
import { ReportTimeline } from "@/components/report/ReportTimeline";
import { ReportSupport } from "@/components/report/ReportSupport";
import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { useEffect, useState } from "react";
import { getCategoryIcon } from "@/lib/utils";
import { Report, ReportCategory, ReportStatus } from "@/lib/types";

const getActorLabel = (actor: any) => {
    if (!actor) return 'Sistem';
    if (actor.role === 'ADMIN') return 'Admin Pemerintahan';
    if (actor.role === 'USER') return '';
    if (actor.role === 'DINAS') {
        const name = actor.name.toLowerCase();
        if (name.includes('pekerjaan umum') || name.includes('pupr')) return 'Dinas PUPR';
        if (name.includes('energi') || name.includes('esdm')) return 'Dinas ESDM';
        if (name.includes('pendidikan')) return 'Dinas Pendidikan';
        if (name.includes('kesehatan')) return 'Dinas Kesehatan';
        return actor.name;
    }
    return actor.name;
};

const getDinasName = (originalName: string) => {
    const name = originalName.toLowerCase();
    if (name.includes('pekerjaan umum') || name.includes('pupr')) return 'Dinas PUPR';
    if (name.includes('energi') || name.includes('esdm')) return 'Dinas ESDM';
    if (name.includes('pendidikan')) return 'Dinas Pendidikan';
    if (name.includes('kesehatan')) return 'Dinas Kesehatan';
    return originalName;
};

export default function ReportDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [report, setReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch(`/api/reports/${id}`);
                if (!res.ok) {
                    setIsLoading(false);
                    return;
                }
                const data = await res.json();
                const apiReport = data.report;

                // Map API data to Report interface
                const mappedReport: Report = {
                    id: apiReport.id,
                    title: apiReport.description, // Use user description as title
                    category: (apiReport.category.charAt(0).toUpperCase() + apiReport.category.slice(1).toLowerCase()) as ReportCategory,
                    date: new Date(apiReport.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    location: apiReport.locationText,
                    fullAddress: apiReport.locationText,
                    status: mapStatus(apiReport.status),
                    statusColor: getStatusColor(apiReport.status),
                    icon: getCategoryIcon((apiReport.category.charAt(0).toUpperCase() + apiReport.category.slice(1).toLowerCase()) as ReportCategory),
                    description: apiReport.description,
                    // Filter out completion images from main gallery
                    image: (apiReport.images.filter((img: any) => img.type !== 'PENYELESAIAN')[0]?.url) ? apiReport.images.filter((img: any) => img.type !== 'PENYELESAIAN')[0]?.url : "/images/no-image-placeholder.png",
                    additionalImages: apiReport.images.filter((img: any) => img.type !== 'PENYELESAIAN').slice(1).map((img: any) => img.url),
                    supportCount: apiReport.supportCount || 0,
                    reporter: apiReport.reporter.name,
                    coordinates: { lat: apiReport.latitude, lng: apiReport.longitude },
                    // Budget Mapping
                    budget: apiReport.budget ? {
                        total: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(apiReport.budget.total)),
                        used: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(apiReport.budget.used)),
                        percentage: apiReport.budget.percentage
                    } : undefined,
                    // Timeline Mapping
                    // Timeline Mapping
                    timeline: [
                        ...apiReport.timeline
                            .filter((t: any) => t.eventType !== "PROGRESS_UPDATE")
                            .map((t: any) => {
                                const actorLabel = getActorLabel(t.actor);
                                return {
                                    dateRaw: new Date(t.createdAt),
                                    date: new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                                    title: actorLabel ? `${actorLabel}: ${t.title}` : t.title,
                                    description: t.description,
                                    status: "completed",
                                    // Inject completion images for COMPLETED event
                                    images: t.eventType === 'COMPLETED'
                                        ? apiReport.images.filter((img: any) => img.type === 'PENYELESAIAN').map((img: any) => img.url)
                                        : [],
                                    budgetUsed: t.budgetUsed > 0 ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(t.budgetUsed) : undefined
                                };
                            }),
                        ...apiReport.progress.map((p: any) => ({
                            dateRaw: new Date(p.createdAt),
                            date: new Date(p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                            title: `${getDinasName(apiReport.dinas?.name || 'Dinas')}: Update Progress`,
                            description: p.description,
                            status: "completed",
                            images: p.images || [],
                            budgetUsed: p.budgetUsed > 0 ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.budgetUsed) : undefined
                        }))
                    ].sort((a, b) => b.dateRaw.getTime() - a.dateRaw.getTime()) // Sort by date desc
                        .map(({ dateRaw, ...item }) => item) // Remove temp dateRaw property
                };

                setReport(mappedReport);
            } catch (error) {
                console.error("Failed to fetch report:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchReport();
        }
    }, [id]);

    const mapStatus = (status: string): ReportStatus => {
        switch (status) {
            case "SELESAI": return "Selesai";
            case "DITOLAK":
            case "DITOLAK_DINAS": return "Ditolak";
            case "MENUNGGU_VERIFIKASI": return "Menunggu";
            default: return "Diproses";
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "SELESAI": return "bg-green-100 text-green-700 border-green-200";
            case "DITOLAK":
            case "DITOLAK_DINAS": return "bg-red-100 text-red-700 border-red-200";
            case "MENUNGGU_VERIFIKASI": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default: return "bg-blue-100 text-blue-700 border-blue-200";
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex h-[80vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="container mx-auto px-4 py-8 text-center bg-gray-50 h-screen flex items-center justify-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Laporan Tidak Ditemukan</h1>
                        <p className="text-gray-500 mt-2">ID Laporan: {id}</p>
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


                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Info & Visual (7 cols) */}
                    <div className="lg:col-span-7 space-y-8">
                        <ReportInfo report={report} />
                        <BudgetTransparency budget={report.budget} />
                    </div>

                    {/* Right Column - Timeline (5 cols) */}
                    <div className="lg:col-span-5">
                        <ReportSupport report={report} />
                        <ReportTimeline timeline={report.timeline} />
                    </div>
                </div>
            </main>
        </div>
    );
}
