"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MapPin, ThumbsUp, Wrench, XCircle, DollarSign } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import dynamic from "next/dynamic"
import { SimpleAlertDialog } from "@/components/ui/simple-alert-dialog"
import { ReportTimeline } from "@/components/report/ReportTimeline"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
    timeline: [
        {
            date: "15 Agu 2024",
            title: "Disposisi ke Dinas PUPR",
            description: "Admin telah memverifikasi laporan dan meneruskan ke Dinas Pekerjaan Umum untuk ditindaklanjuti.",
            status: "completed" as const
        },
        {
            date: "14 Agu 2024",
            title: "Verifikasi Admin",
            description: "Laporan telah diverifikasi oleh admin pusat.",
            status: "completed" as const
        },
        {
            date: "14 Agu 2024",
            title: "Laporan Masuk",
            description: "Laporan baru diterima sistem.",
            status: "completed" as const
        }
    ]
}

export default function DinasReportDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    // Form States
    const [verificationNotes, setVerificationNotes] = useState("")
    const [initialBudget, setInitialBudget] = useState("")
    const [isVerifyOpen, setIsVerifyOpen] = useState(false)

    // State for logic
    // Initial status for Dinas is "Belum Diverifikasi" (meaning pending action from Dinas)
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

    const handleProcess = () => {
        if (!verificationNotes.trim()) {
            // This check might be redundant if we use the Dialog validation visually, 
            // but good for safety if we trigger this function manually.
            return
        }

        // Simulate API call
        console.log("Processing Report:", {
            id,
            notes: verificationNotes,
            budget: initialBudget
        })

        setStatus("Dalam Pengerjaan")
        setIsVerifyOpen(false)
        // router.push("/dinas/laporan/progress")
    }

    const handleReject = () => {
        if (!verificationNotes.trim()) {
            setAlertConfig({
                open: true,
                title: "Catatan Diperlukan",
                description: "Mohon isi catatan alasan penolakan sebelum menolak laporan.",
                confirmText: "Mengerti",
                variant: "default",
                onConfirm: () => { }
            })
            return
        }

        setAlertConfig({
            open: true,
            title: "Tolak Laporan",
            description: "Apakah Anda yakin ingin menolak laporan ini? Laporan akan ditandai sebagai 'Ditolak'.",
            confirmText: "Tolak Laporan",
            variant: "destructive",
            onConfirm: () => {
                setStatus("Ditolak")
                // Simulate redirect to Selesai/Ditolak page
                router.push("/dinas/laporan/selesai")
            }
        })
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
                <Link href="/dinas/laporan/belum-diverifikasi">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Detail Laporan #{id}</h2>
                    <p className="text-muted-foreground">
                        Tinjau laporan masuk dan tentukan tindakan selanjutnya.
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
                                    <p className="text-xs text-muted-foreground mb-1">Status Dinas</p>
                                    <Badge
                                        variant={status === "Ditolak" ? "destructive" : "secondary"}
                                        className={`${status === "Dalam Pengerjaan" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                                            status === "Belum Diverifikasi" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                                                ""
                                            }`}
                                    >
                                        {status === "Belum Diverifikasi" ? "Perlu Tindakan" : status}
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

                    {/* Timeline Component */}
                    <ReportTimeline timeline={reportData.timeline} />

                    {/* Verification Action Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Verifikasi Laporan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {status === "Belum Diverifikasi" ? (
                                <>
                                    <div className="space-y-2">
                                        <label htmlFor="notes" className="text-sm font-medium">Catatan Verifikasi</label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Tambahkan catatan verifikasi atau alasan penolakan..."
                                            value={verificationNotes}
                                            onChange={(e) => setVerificationNotes(e.target.value)}
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={handleReject}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Tolak
                                        </Button>

                                        <Dialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                                                    <Wrench className="mr-2 h-4 w-4" />
                                                    Verifikasi & Proses
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Verifikasi & Tetapkan Anggaran</DialogTitle>
                                                    <DialogDescription>
                                                        Sebelum memproses, tentukan estimasi anggaran yang dibutuhkan untuk perbaikan ini.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label>Catatan Verifikasi</Label>
                                                        <Textarea
                                                            value={verificationNotes}
                                                            onChange={(e) => setVerificationNotes(e.target.value)}
                                                            className="bg-muted/50"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Estimasi Anggaran</Label>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input
                                                                type="text"
                                                                placeholder="Contoh: 50.000.000"
                                                                className="pl-9"
                                                                value={initialBudget}
                                                                onChange={(e) => setInitialBudget(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsVerifyOpen(false)}>Batal</Button>
                                                    <Button
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                        onClick={handleProcess}
                                                        disabled={!verificationNotes}
                                                    >
                                                        Konfirmasi & Proses
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </>
                            ) : status === "Dalam Pengerjaan" ? (
                                <div className="p-4 bg-blue-50 text-blue-700 rounded-md text-sm text-center border border-blue-200">
                                    <Wrench className="h-5 w-5 mx-auto mb-2" />
                                    <p className="font-semibold">Laporan Sedang Dikerjakan</p>
                                    <p className="text-xs mt-1">Status telah diperbarui menjadi Dalam Pengerjaan.</p>
                                </div>
                            ) : (
                                <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm text-center border border-red-200">
                                    <XCircle className="h-5 w-5 mx-auto mb-2" />
                                    <p className="font-semibold">Laporan Ditolak</p>
                                    <p className="text-xs mt-1">Laporan telah ditolak dengan catatan: "{verificationNotes}"</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
