"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, ThumbsUp, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import dynamic from "next/dynamic"
import { ReportTimeline } from "@/components/report/ReportTimeline"
import { BudgetTransparency } from "@/components/report/BudgetTransparency"

const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse flex items-center justify-center">Loading Map...</div>
})

// Mock Data for a specific progress report
const reportData = {
    id: "7285",
    date: "14 Agustus 2024",
    status: "Dalam Progress",
    description: "Perbaikan jalan berlubang di Jalan A. Yani sedang dalam tahap pengerjaan lapis pondasi agregat. Alat berat sudah dikerahkan ke lokasi.",
    images: [
        "https://images.unsplash.com/photo-1546768292-fb12f6c92568?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1621939514649-28b12e81658e?q=80&w=2070&auto=format&fit=crop"
    ],
    category: "Jalan",
    location: "Jl. A. Yani, Kec. Cempaka Putih, Jakarta Pusat",
    coordinates: { lat: -6.175392, lng: 106.827153 },
    reporter: "Siti Aminah",
    supportCount: 156,
    budget: {
        total: "Rp 200.000.000",
        used: "Rp 85.000.000",
        percentage: 42.5
    },
    timeline: [
        {
            date: "17 Agu 2024",
            title: "Pengerjaan Lapis Pondasi",
            description: "Tim teknis sedang melakukan pemadatan lapisan pondasi jalan. Material batu pecah telah dihamparkan dan dipadatkan menggunakan vibro roller.",
            status: "in_progress" as const,
            budgetUsed: "Penggunaan Anggaran: Rp 35.000.000 (Pembelian Batu Pecah & Sewa Alat Berat)",
            images: [
                "https://images.unsplash.com/photo-1590497576628-9b884d41fa21?q=80&w=2074&auto=format&fit=crop", // Heavy machinery
                "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"  // Construction work
            ]
        },
        {
            date: "16 Agu 2024",
            title: "Pembelian Material",
            description: "Material batu pecah, pasir, dan aspal telah dibeli dan dikirim ke lokasi proyek. Bukti penerimaan barang terlampir.",
            status: "completed" as const,
            budgetUsed: "Penggunaan Anggaran: Rp 50.000.000 (Material Utama)",
            images: [
                "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?q=80&w=2019&auto=format&fit=crop", // Raw material
                "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop"  // Stacks of material
            ]
        },
        {
            date: "15 Agu 2024",
            title: "Dinas Melakukan Verifikasi Lapangan",
            description: "Tim survei Dinas PUPR telah meninjau lokasi untuk menghitung kebutuhan material dan estimasi anggaran. Anggaran disetujui.",
            status: "completed" as const,
            images: [
                "https://images.unsplash.com/photo-1599695696803-c37617478082?q=80&w=2070&auto=format&fit=crop" // Surveying
            ]
        },
        {
            date: "14 Agu 2024",
            title: "Laporan Didisposisikan ke Dinas PUPR",
            description: "Admin telah memverifikasi laporan dan meneruskan ke Dinas Pekerjaan Umum untuk ditindaklanjuti.",
            status: "completed" as const
        },
        {
            date: "14 Agu 2024",
            title: "Laporan Masuk",
            description: "Laporan baru diterima sistem dan menunggu verifikasi admin.",
            status: "completed" as const
        }
    ]
}

export default function ProgressReportDetailPage() {
    const params = useParams()
    const id = params.id as string
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/laporan/progress">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Detail Laporan #{id}</h2>
                    <p className="text-muted-foreground">
                        Pantau perkembangan penanganan laporan masyarakat.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Report Details (Takes up 2 columns) */}
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
                                {reportData.images.map((img, index) => (
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
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">
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

                    {/* Budget */}
                    <BudgetTransparency budget={reportData.budget} />
                </div>
            </div>
        </div>
    )
}
