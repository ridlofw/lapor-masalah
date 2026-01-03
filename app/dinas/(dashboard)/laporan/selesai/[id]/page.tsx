"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, ThumbsUp, Calendar, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { ReportTimeline } from "@/components/report/ReportTimeline"
import { BudgetTransparency } from "@/components/report/BudgetTransparency"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { ZoomableImage } from "@/components/ui/zoomable-image"
import { Report, ReportCategory, ReportStatus } from "@/lib/types"
import { getCategoryIcon } from "@/lib/utils"

const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse flex items-center justify-center">Loading Map...</div>
})

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

export default function CompletedReportDetailPage() {
    const params = useParams()
    const id = params.id as string
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    const [report, setReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch(`/api/reports/${id}`);
                if (!res.ok) {
                    setIsLoading(false);
                    return; // Handle error UI separately if needed
                }
                const data = await res.json();
                const apiReport = data.report;

                // Map API data to Report interface
                const mappedReport: Report = {
                    id: apiReport.id,
                    title: `Laporan ${apiReport.category}`,
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
                    rejectionReason: apiReport.rejectionReason,
                    budget: apiReport.budget ? {
                        total: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(apiReport.budget.total)),
                        used: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(apiReport.budget.used)),
                        percentage: apiReport.budget.percentage
                    } : undefined,
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
                    ].sort((a, b) => b.dateRaw.getTime() - a.dateRaw.getTime())
                        .map(({ dateRaw, ...item }) => item)
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
            default: return "bg-blue-100 text-blue-700 border-blue-200";
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!report) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/dinas/laporan/selesai">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h2 className="text-2xl font-bold tracking-tight">Laporan Tidak Ditemukan</h2>
                </div>
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">Data laporan dengan ID tersebut tidak ditemukan.</p>
                </div>
            </div>
        );
    }

    const isRejected = report.status === "Ditolak"
    const isCompleted = report.status === "Selesai"

    // Construct images array
    const images = [report.image, ...(report.additionalImages || [])].filter(Boolean);
    const defaultCoordinates = { lat: -6.2088, lng: 106.8456 };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dinas/laporan/selesai">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Detail Laporan #{id.slice(0, 8)}</h2>
                    <p className="text-muted-foreground">
                        {isRejected ? "Detail laporan yang ditolak." : "Arsip laporan yang telah selesai ditangani."}
                    </p>
                </div>
            </div>

            {/* Status Banners */}
            {isRejected && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Laporan Ditolak</AlertTitle>
                    <AlertDescription className="mt-1">
                        <strong>Alasan Penolakan:</strong> {report.rejectionReason || "Tidak ada alasan spesifik."}
                    </AlertDescription>
                </Alert>
            )}

            {isCompleted && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Laporan Selesai</AlertTitle>
                    <AlertDescription className="text-green-700 mt-1">
                        Laporan ini telah berhasil ditangani dan ditutup.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Report Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="overflow-hidden border-border/60 shadow-sm p-0 gap-0">
                        {/* Main Image */}
                        <div className="relative w-full aspect-video bg-muted border-b">
                            {images.length > 0 ? (
                                <ZoomableImage
                                    src={images[activeImageIndex]}
                                    alt={`Report Image ${activeImageIndex + 1}`}
                                    className="w-full h-full"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 p-4 overflow-x-auto border-b bg-gray-50/50">
                                {images.map((img: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-all ${index === activeImageIndex ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Dilaporkan pada {report.date}
                                </p>
                                <Badge
                                    variant={isRejected ? "destructive" : "default"}
                                    className={isCompleted ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" : ""}
                                >
                                    {report.status}
                                </Badge>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Deskripsi Laporan</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {report.description}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                Lokasi & Peta
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="font-medium text-sm text-foreground">{report.location}</p>
                            <div className="h-[300px] w-full rounded-lg overflow-hidden border relative z-0">
                                <LocationPicker
                                    center={report.coordinates || defaultCoordinates}
                                    onLocationSelect={() => { }} // Read-only
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Detail Informasi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Kategori</p>
                                    <p className="font-medium text-sm">{report.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Pelapor</p>
                                    <p className="font-medium text-sm">{report.reporter}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Status, Budget, History */}
                <div className="space-y-6">
                    {/* Support Stats Card */}
                    <Card className="group bg-white border-slate-200 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-slate-500">Total Dukungan</p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="text-4xl font-bold tracking-tight text-slate-900">
                                            {report.supportCount}
                                        </span>
                                        <div className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                            Warga
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 max-w-[200px] leading-relaxed">
                                        Mendukung agar laporan ini segera ditindaklanjuti.
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <ThumbsUp className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <ReportTimeline timeline={report.timeline} />

                    {/* Budget - Only show if report has budget data (not rejected) */}
                    {report.budget && (
                        <BudgetTransparency budget={report.budget} />
                    )}
                </div>
            </div>
        </div>
    )
}
