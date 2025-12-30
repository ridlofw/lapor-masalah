"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MapPin, ThumbsUp, Wrench, XCircle, DollarSign, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
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
    reporter: { id: string; name: string }
    timeline: { id: string; eventType: string; title: string; description: string; createdAt: string }[]
    adminNote?: string
    createdAt: string
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

export default function DinasReportDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [report, setReport] = useState<ReportData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    // Form States
    const [verificationNotes, setVerificationNotes] = useState("")
    const [initialBudget, setInitialBudget] = useState("")
    const [isVerifyOpen, setIsVerifyOpen] = useState(false)

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
        async function fetchReport() {
            try {
                const response = await fetch(`/api/reports/${id}`)
                if (response.ok) {
                    const data = await response.json()
                    setReport(data.report)
                }
            } catch (error) {
                console.error("Failed to fetch report:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchReport()
    }, [id])

    const handleProcess = async () => {
        if (!verificationNotes.trim()) return

        setIsSubmitting(true)
        try {
            // First verify
            const verifyResponse = await fetch(`/api/dinas/reports/${id}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note: verificationNotes }),
            })

            if (!verifyResponse.ok) {
                const data = await verifyResponse.json()
                alert(data.error || "Gagal memverifikasi laporan")
                return
            }

            // Then set budget if provided
            if (initialBudget) {
                const budgetValue = initialBudget.replace(/\D/g, '')
                if (budgetValue) {
                    await fetch(`/api/dinas/reports/${id}/budget`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ budgetTotal: Number(budgetValue) }),
                    })
                }
            }

            setIsVerifyOpen(false)
            router.push("/dinas/laporan/progress")
        } catch (error) {
            console.error("Process error:", error)
            alert("Terjadi kesalahan")
        } finally {
            setIsSubmitting(false)
        }
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
            description: "Apakah Anda yakin ingin menolak laporan ini? Laporan akan dikembalikan ke Admin.",
            confirmText: "Tolak Laporan",
            variant: "destructive",
            onConfirm: async () => {
                setIsSubmitting(true)
                try {
                    const response = await fetch(`/api/dinas/reports/${id}/reject`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ reason: verificationNotes }),
                    })

                    if (response.ok) {
                        router.push("/dinas/laporan/selesai")
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
                <Link href="/dinas/laporan/belum-diverifikasi">
                    <Button variant="outline" className="mt-4">Kembali</Button>
                </Link>
            </div>
        )
    }

    const images = report.images.length > 0
        ? report.images.map(img => img.url)
        : ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070"]

    const timelineData = report.timeline.map(t => ({
        date: formatDate(t.createdAt),
        title: t.title,
        description: t.description,
        status: "completed" as const
    }))

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
                    <h2 className="text-2xl font-bold tracking-tight">Detail Laporan #{id.slice(0, 8)}</h2>
                    <p className="text-muted-foreground">
                        Tinjau laporan masuk dan tentukan tindakan selanjutnya.
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
                            {report.adminNote && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                                    <p className="text-xs font-medium text-blue-700 mb-1">Catatan dari Admin:</p>
                                    <p className="text-sm text-blue-600">{report.adminNote}</p>
                                </div>
                            )}
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
                                    <p className="text-xs text-muted-foreground mb-1">Status Dinas</p>
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                        Perlu Verifikasi
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

                    <ReportTimeline timeline={timelineData} />

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Verifikasi Laporan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="notes" className="text-sm font-medium">Catatan Verifikasi</label>
                                <Textarea
                                    id="notes"
                                    placeholder="Tambahkan catatan verifikasi atau alasan penolakan..."
                                    value={verificationNotes}
                                    onChange={(e) => setVerificationNotes(e.target.value)}
                                    className="min-h-[100px]"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={handleReject}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                                    Tolak
                                </Button>

                                <Dialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
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
                                                <Label>Estimasi Anggaran (Rp)</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="text"
                                                        placeholder="Contoh: 50000000"
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
                                                disabled={!verificationNotes || isSubmitting}
                                            >
                                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                Konfirmasi & Proses
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
