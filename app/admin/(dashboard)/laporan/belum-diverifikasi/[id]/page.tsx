"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle2, XCircle, MapPin, Send, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import dynamic from "next/dynamic"
import { SimpleAlertDialog } from "@/components/ui/simple-alert-dialog"
import Image from "next/image"
import { ZoomableImage } from "@/components/ui/zoomable-image"

const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse flex items-center justify-center">Loading Map...</div>
})

// Mock Data for a specific report
const reportData = {
    id: "7281",
    date: "14 Agustus 2024",
    description: "Lubang besar di Jalan Merdeka No. 12, tepat di depan gerbang sekolah dasar, sangat membahayakan anak-anak dan pengendara. Kondisinya semakin parah saat hujan karena tergenang air dan tidak terlihat. Mohon segera diperbaiki untuk mencegah kecelakaan.",
    images: [
        "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1584463673574-896131336423?q=80&w=2069&auto=format&fit=crop",
        "https://plus.unsplash.com/premium_photo-1663045625458-385075677d24?q=80&w=2070&auto=format&fit=crop"
    ],
    category: "Jalan",
    location: "Jl. Merdeka No. 12, Kel. Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat",
    coordinates: { lat: -6.914744, lng: 107.609810 }, // Bandung
    reporter: "Budi Santoso",
    supportCount: 56, // Total Dukungan
}

export default function ReportDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    // State for logic
    const [status, setStatus] = useState("Belum Diverifikasi")
    const [alertConfig, setAlertConfig] = useState<{
        open: boolean
        title: string
        description: string
        onConfirm: () => void
        variant?: "default" | "destructive" | "success"
        confirmText?: string
    }>({
        open: false,
        title: "",
        description: "",
        onConfirm: () => { },
    })

    const handleVerify = () => {
        setAlertConfig({
            open: true,
            title: "Verifikasi Laporan",
            description: "Apakah Anda yakin ingin memverifikasi laporan ini? Status akan berubah menjadi Terverifikasi.",
            confirmText: "Verifikasi",
            variant: "success",
            onConfirm: () => {
                setStatus("Terverifikasi")
                // In a real app, API call here
            }
        })
    }

    const handleReject = () => {
        setAlertConfig({
            open: true,
            title: "Tolak Laporan",
            description: "Apakah Anda yakin ingin menolak laporan ini? Laporan akan ditandai sebagai Selesai (Ditolak).",
            confirmText: "Tolak Laporan",
            variant: "destructive",
            onConfirm: () => {
                setStatus("Ditolak")
                // Simulate redirect to Selesai page
                router.push("/admin/laporan/selesai")
            }
        })
    }

    const handleDisposisi = () => {
        // Redirect to Progress page
        router.push("/admin/laporan/progress")
    }

    return (
        <div className="space-y-6">
            <SimpleAlertDialog
                open={alertConfig.open}
                onOpenChange={(open) => setAlertConfig(prev => ({ ...prev, open }))}
                title={alertConfig.title}
                description={alertConfig.description}
                onConfirm={alertConfig.onConfirm}
                confirmText={alertConfig.confirmText}
                variant={alertConfig.variant}
            />

            <div className="flex items-center gap-4">
                <Link href="/admin/laporan/belum-diverifikasi">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Detail Laporan #{id}</h2>
                    <p className="text-muted-foreground">
                        Verifikasi, tolak, atau disposisi laporan dari masyarakat.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Report Details (Takes up 2 columns) */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="overflow-hidden p-0 gap-0">
                        {/* Main Image */}
                        <div className="relative w-full aspect-video bg-muted border-b">
                            <ZoomableImage
                                src={reportData.images[activeImageIndex]}
                                alt={`Report Image ${activeImageIndex + 1}`}
                                className="w-full h-full"
                            />
                        </div>

                        {/* Thumbnails */}
                        {reportData.images.length > 1 && (
                            <div className="flex gap-2 p-4 overflow-x-auto border-b bg-gray-50/50">
                                {reportData.images.map((img, index) => (
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
                            <div className="mb-4">
                                <p className="text-sm text-muted-foreground">Dilaporkan pada {reportData.date}</p>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {reportData.description}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Lokasi & Peta</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <p className="font-medium text-sm">{reportData.location}</p>
                            </div>
                            <div className="h-[300px] w-full rounded-md overflow-hidden border relative z-0">
                                <LocationPicker
                                    center={reportData.coordinates}
                                    onLocationSelect={() => { }} // Read-only
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
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
                                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                                    <Badge
                                        variant={status === "Ditolak" ? "destructive" : "secondary"}
                                        className={`${status === "Terverifikasi" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                                            status === "Belum Diverifikasi" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                                                ""
                                            }`}
                                    >
                                        {status}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Pelapor</p>
                                <p className="font-medium text-sm">{reportData.reporter}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Actions */}
                <div className="space-y-6">
                    {/* Support Stats Card */}
                    <Card className="group bg-white border-slate-200 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-slate-500">Total Dukungan</p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="text-4xl font-bold tracking-tight text-slate-900">
                                            {reportData.supportCount}
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

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Aksi Verifikasi</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {status === "Belum Diverifikasi" ? (
                                <>
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        onClick={handleVerify}
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Verifikasi Laporan
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={handleReject}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Tolak Laporan
                                    </Button>
                                </>
                            ) : status === "Terverifikasi" ? (
                                <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm text-center border border-green-200">
                                    <CheckCircle2 className="h-5 w-5 mx-auto mb-1" />
                                    Laporan Telah Diverifikasi
                                </div>
                            ) : (
                                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm text-center border border-red-200">
                                    <XCircle className="h-5 w-5 mx-auto mb-1" />
                                    Laporan Ditolak
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Disposisi Laporan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pilih Dinas Terkait</label>
                                <Select disabled={status === "Ditolak"}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Dinas..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pupr">Dinas Pekerjaan Umum dan Penataan Ruang (Dinas PUPR)</SelectItem>
                                        <SelectItem value="pendidikan">Dinas Pendidikan</SelectItem>
                                        <SelectItem value="kesehatan">Dinas Kesehatan</SelectItem>
                                        <SelectItem value="esdm">Dinas Energi dan Sumber Daya Mineral (Dinas ESDM)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Keterangan (Opsional)</label>
                                <Textarea
                                    placeholder="Tambahkan catatan untuk dinas terkait..."
                                    className="min-h-[100px]"
                                    disabled={status === "Ditolak"}
                                />
                            </div>
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={status === "Ditolak"}
                                onClick={handleDisposisi}
                            >
                                <Send className="mr-2 h-4 w-4" />
                                <Send className="mr-2 h-4 w-4" />
                                Disposisi ke Dinas
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
