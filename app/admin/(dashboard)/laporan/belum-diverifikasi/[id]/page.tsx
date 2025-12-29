"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle2, XCircle, MapPin, Send, ThumbsUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { SimpleAlertDialog } from "@/components/ui/simple-alert-dialog"
import Image from "next/image"
import { ZoomableImage } from "@/components/ui/zoomable-image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse flex items-center justify-center">Loading Map...</div>
})

interface ReportData {
    id: string
    description: string
    category: string
    locationText: string
    latitude: number
    longitude: number
    status: string
    supportCount: number
    images: { id: string; url: string; type: string }[]
    reporter: { id: string; name: string; avatar?: string }
    createdAt: string
    rejectionReason?: string
}

interface Dinas {
    id: string
    name: string
    type: string
}

const CATEGORY_TO_DINAS: Record<string, string> = {
    JALAN: "PUPR",
    JEMBATAN: "PUPR",
    SEKOLAH: "DIKNAS",
    KESEHATAN: "DINKES",
    AIR: "ESDM",
    LISTRIK: "ESDM",
};


function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

function formatCategory(category: string): string {
    const map: Record<string, string> = {
        JALAN: "Jalan",
        JEMBATAN: "Jembatan",
        SEKOLAH: "Sekolah",
        KESEHATAN: "Kesehatan",
        AIR: "Air",
        LISTRIK: "Listrik",
    }
    return map[category] || category
}

export default function ReportDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [report, setReport] = useState<ReportData | null>(null)
    const [dinasList, setDinasList] = useState<Dinas[]>([])
    const [selectedDinasId, setSelectedDinasId] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [adminNote, setAdminNote] = useState("")
    const [rejectReason, setRejectReason] = useState("")


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

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch report
                const reportRes = await fetch(`/api/reports/${id}`)
                let reportData = null
                if (reportRes.ok) {
                    const data = await reportRes.json()
                    reportData = data.report
                    setReport(reportData)
                }

                // Fetch dinas list
                const dinasRes = await fetch("/api/admin/dinas")
                let fetchedDinas: Dinas[] = []
                if (dinasRes.ok) {
                    const data = await dinasRes.json()
                    fetchedDinas = data.dinas
                    setDinasList(fetchedDinas)
                }

                // Initial selection logic
                if (reportData && fetchedDinas.length > 0) {
                    const targetType = CATEGORY_TO_DINAS[reportData.category as string]
                    const defaultDinas = fetchedDinas.find(d => d.type === targetType)
                    if (defaultDinas) {
                        setSelectedDinasId(defaultDinas.id)
                    } else if (fetchedDinas.length > 0) {
                        setSelectedDinasId(fetchedDinas[0].id)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [id])


    const handleDispose = async () => {
        if (!selectedDinasId) {
            alert("Silakan pilih Dinas tujuan terlebih dahulu")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/admin/reports/${id}/dispose`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note: adminNote, dinasId: selectedDinasId }),
            })


            if (response.ok) {
                router.push("/admin/laporan/progress")
            } else {
                const data = await response.json()
                alert(data.error || "Gagal mendisposisi laporan")
            }
        } catch (error) {
            console.error("Dispose error:", error)
            alert("Terjadi kesalahan")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReject = () => {
        if (!rejectReason.trim()) {
            alert("Alasan penolakan harus diisi")
            return
        }

        setAlertConfig({
            open: true,
            title: "Tolak Laporan",
            description: "Apakah Anda yakin ingin menolak laporan ini? Laporan akan ditandai sebagai Ditolak.",
            confirmText: "Tolak Laporan",
            variant: "destructive",
            onConfirm: async () => {
                setIsSubmitting(true)
                try {
                    const response = await fetch(`/api/admin/reports/${id}/reject`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ reason: rejectReason }),
                    })

                    if (response.ok) {
                        router.push("/admin/laporan/selesai")
                    } else {
                        const data = await response.json()
                        alert(data.error || "Gagal menolak laporan")
                    }
                } catch (error) {
                    console.error("Reject error:", error)
                    alert("Terjadi kesalahan")
                } finally {
                    setIsSubmitting(false)
                }
            }
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!report) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Laporan tidak ditemukan</p>
                <Link href="/admin/laporan/belum-diverifikasi">
                    <Button variant="outline" className="mt-4">Kembali</Button>
                </Link>
            </div>
        )
    }

    const images = report.images.length > 0
        ? report.images.map(img => img.url)
        : ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070"]

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
                    <h2 className="text-2xl font-bold tracking-tight">Detail Laporan #{id.slice(0, 8)}</h2>
                    <p className="text-muted-foreground">
                        Verifikasi, tolak, atau disposisi laporan dari masyarakat.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Report Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="overflow-hidden p-0 gap-0">
                        <div className="relative w-full aspect-video bg-muted border-b">
                            <ZoomableImage
                                src={images[activeImageIndex]}
                                alt={`Report Image ${activeImageIndex + 1}`}
                                className="w-full h-full"
                            />
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-2 p-4 overflow-x-auto border-b bg-gray-50/50">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-all ${index === activeImageIndex ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"}`}
                                    >
                                        <Image src={img} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <CardContent className="p-6">
                            <div className="mb-4">
                                <p className="text-sm text-muted-foreground">Dilaporkan pada {formatDate(report.createdAt)}</p>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {report.description}
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
                                <p className="font-medium text-sm">{report.locationText}</p>
                            </div>
                            <div className="h-[300px] w-full rounded-md overflow-hidden border relative z-0">
                                <LocationPicker
                                    center={{ lat: report.latitude, lng: report.longitude }}
                                    onLocationSelect={() => { }}
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
                                    <p className="font-medium text-sm">{formatCategory(report.category)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                        {report.status === "DITOLAK_DINAS" ? "Dikembalikan Dinas" : "Belum Diverifikasi"}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Pelapor</p>
                                <p className="font-medium text-sm">{report.reporter.name}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Actions */}
                <div className="space-y-6">
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
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <ThumbsUp className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Tolak Laporan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Alasan Penolakan *</label>
                                <Textarea
                                    placeholder="Jelaskan alasan penolakan laporan..."
                                    className="min-h-[80px]"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={handleReject}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <XCircle className="mr-2 h-4 w-4" />
                                )}
                                Tolak Laporan
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Disposisi ke Dinas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pilih Dinas Tujuan</label>
                                <Select value={selectedDinasId} onValueChange={setSelectedDinasId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Dinas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dinasList.map((dinas) => (
                                            <SelectItem key={dinas.id} value={dinas.id}>
                                                {dinas.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {report.category && (() => {
                                    const targetType = CATEGORY_TO_DINAS[report.category]
                                    const recommendedDinas = dinasList.find(d => d.type === targetType)
                                    const isRecommended = recommendedDinas?.id === selectedDinasId

                                    if (isRecommended) {
                                        return (
                                            <p className="text-xs text-muted-foreground ml-1">
                                                Rekomendasi kategori: {formatCategory(report.category)}
                                            </p>
                                        )
                                    }
                                    return null
                                })()}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Catatan untuk Dinas (Opsional)</label>
                                <Textarea
                                    placeholder="Tambahkan catatan untuk dinas terkait..."
                                    className="min-h-[80px]"
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                onClick={handleDispose}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="mr-2 h-4 w-4" />
                                )}
                                Terima & Disposisi ke Dinas
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
