"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, ThumbsUp, Calendar, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import dynamic from "next/dynamic"
import { ReportTimeline } from "@/components/report/ReportTimeline"
import { BudgetTransparency } from "@/components/report/BudgetTransparency"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse flex items-center justify-center">Loading Map...</div>
})

// Mock Data for specific reports (Completed and Rejected)
const reportsData: Record<string, any> = {
    "7290": {
        id: "7290",
        date: "10 Agustus 2024",
        status: "Selesai",
        description: "Pohon tumbang di Jalan Mawar telah berhasil dievakuasi. Jalanan sudah bersih dan dapat dilalui kendaraan kembali.",
        rejectionReason: null,
        images: [
            "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1974&auto=format&fit=crop", // Clean road
            "https://images.unsplash.com/photo-1621939514649-28b12e81658e?q=80&w=2070&auto=format&fit=crop"
        ],
        category: "Pohon Tumbang",
        location: "Jl. Mawar, Jakarta Selatan",
        coordinates: { lat: -6.261493, lng: 106.810600 },
        reporter: "Budi Santoso",
        supportCount: 42,
        budget: {
            total: "Rp 5.000.000",
            used: "Rp 4.800.000",
            percentage: 96
        },
        timeline: [
            {
                date: "11 Agu 2024",
                title: "Laporan Selesai",
                description: "Penanganan selesai. Lokasi telah bersih dan aman.",
                status: "completed" as const,
                images: ["https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1974&auto=format&fit=crop"]
            },
            {
                date: "10 Agu 2024",
                title: "Evakuasi Pohon Tumbang",
                description: "Petugas Dinas Pertamanan melakukan pemotongan dan pengangkutan batang pohon.",
                status: "completed" as const,
                budgetUsed: "Penggunaan Anggaran: Rp 4.800.000 (Operasional & BBM)",
                images: ["https://images.unsplash.com/photo-1610557892470-55d9e80c0b6b?q=80&w=2069&auto=format&fit=crop"]
            },
            {
                date: "10 Agu 2024",
                title: "Laporan Diverifikasi & Didisposisikan",
                description: "Laporan diverifikasi admin dan diteruskan ke Dinas Pertamanan.",
                status: "completed" as const
            },
            {
                date: "10 Agu 2024",
                title: "Laporan Masuk",
                description: "Laporan diterima sistem.",
                status: "completed" as const
            }
        ]
    },
    "7293": {
        id: "7293",
        date: "12 Agustus 2024",
        status: "Ditolak",
        description: "Laporan mengenai lampu taman mati di Taman Mini.",
        rejectionReason: "Laporan tidak valid. Lokasi yang dilaporkan merupakan area privat yang bukan tanggung jawab pemerintah kota, melainkan pengelola kawasan wisata.",
        images: [
            "https://images.unsplash.com/photo-1562572159-4efc207f5aff?q=80&w=1935&auto=format&fit=crop"
        ],
        category: "Lampu Taman",
        location: "Taman Mini, Jakarta Timur",
        coordinates: { lat: -6.291771, lng: 106.895317 },
        reporter: "Dewi Lestari",
        supportCount: 5,
        budget: null, // No budget for rejected reports
        timeline: [
            {
                date: "13 Agu 2024",
                title: "Laporan Ditolak",
                description: "Laporan ditolak karena berada di luar kewenangan pemerintah kota.",
                status: "completed" as const
            },
            {
                date: "12 Agu 2024",
                title: "Laporan Masuk",
                description: "Laporan diterima sistem.",
                status: "completed" as const
            }
        ]
    }
}

export default function CompletedReportDetailPage() {
    const params = useParams()
    const id = params.id as string
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    // Fallback if ID not found in mock data, default to 7290 (Selesai) for demo purposes if random ID used
    const reportData = reportsData[id] || reportsData["7290"]

    const isRejected = reportData.status === "Ditolak"
    const isCompleted = reportData.status === "Selesai"

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/laporan/selesai">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Detail Laporan #{id}</h2>
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
                        <strong>Alasan Penolakan:</strong> {reportData.rejectionReason}
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
                    <Card className="overflow-hidden border-border/60 shadow-sm">
                        {/* Main Image */}
                        <div className="relative h-[400px] w-full bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={reportData.images[activeImageIndex]}
                                alt={`Report Image ${activeImageIndex + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Thumbnails */}
                        {reportData.images.length > 1 && (
                            <div className="flex gap-2 p-4 overflow-x-auto border-b">
                                {reportData.images.map((img: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all ${index === activeImageIndex ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Dilaporkan pada {reportData.date}
                                </p>
                                <Badge
                                    variant={isRejected ? "destructive" : "default"}
                                    className={isCompleted ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" : ""}
                                >
                                    {reportData.status}
                                </Badge>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Deskripsi Laporan</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {reportData.description}
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
                            <p className="font-medium text-sm text-foreground">{reportData.location}</p>
                            <div className="h-[300px] w-full rounded-lg overflow-hidden border relative z-0">
                                <LocationPicker
                                    center={reportData.coordinates}
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
                                    <p className="font-medium text-sm">{reportData.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Pelapor</p>
                                    <p className="font-medium text-sm">{reportData.reporter}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Status, Budget, History */}
                <div className="space-y-6">
                    {/* Support Stats Card */}
                    <Card className="border-border/60 shadow-sm bg-primary/5 border-primary/20">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Total Dukungan</p>
                                <p className="text-3xl font-bold tracking-tight">{reportData.supportCount}</p>
                                <p className="text-xs text-muted-foreground">Warga mendukung laporan ini</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <ThumbsUp className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <ReportTimeline timeline={reportData.timeline} />

                    {/* Budget - Only show if report has budget data (not rejected) */}
                    {reportData.budget && (
                        <BudgetTransparency budget={reportData.budget} />
                    )}
                </div>
            </div>
        </div>
    )
}
