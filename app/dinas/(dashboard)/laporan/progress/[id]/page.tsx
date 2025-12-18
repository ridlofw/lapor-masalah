"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, ThumbsUp, Calendar, CheckCircle2, DollarSign, Camera, FileText, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import dynamic from "next/dynamic"
import { ReportTimeline } from "@/components/report/ReportTimeline"
import { BudgetTransparency } from "@/components/report/BudgetTransparency"
import { SimpleAlertDialog } from "@/components/ui/simple-alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { ZoomableImage } from "@/components/ui/zoomable-image"

const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse flex items-center justify-center">Loading Map...</div>
})

// Initial Mock Data - Start with 0 budget
const initialReportData = {
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
        total: 0, // Initially 0
        used: 0,
        percentage: 0
    },
    timeline: [
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
    const router = useRouter()
    const id = params.id as string
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    // State for data management (mocking DB)
    const [reportData, setReportData] = useState(initialReportData)
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const [isCompleteOpen, setIsCompleteOpen] = useState(false)
    const [isBudgetOpen, setIsBudgetOpen] = useState(false)

    // Form States
    const [progressDesc, setProgressDesc] = useState("")
    const [progressBudget, setProgressBudget] = useState("")
    const [initialBudgetInput, setInitialBudgetInput] = useState("")
    const [completionDesc, setCompletionDesc] = useState("")

    // Alert State
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

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val)
    }

    const handleSetBudget = () => {
        const budgetAmount = parseInt(initialBudgetInput.replace(/\D/g, '') || '0')
        if (budgetAmount <= 0) return

        setReportData(prev => ({
            ...prev,
            budget: {
                ...prev.budget,
                total: budgetAmount,
                // Recalculate percentage if used > 0 (edge case)
                percentage: (prev.budget.used / budgetAmount) * 100
            }
        }))
        setIsBudgetOpen(false)
    }

    const handleUpdateProgress = () => {
        const budgetAmount = parseInt(progressBudget.replace(/\D/g, '') || '0')

        // Validation: Cannot add budget usage if total budget (Pagu) is 0
        if (budgetAmount > 0 && reportData.budget.total === 0) {
            setAlertConfig({
                open: true,
                title: "Aksi Ditolak",
                description: "Pagu Anggaran Belum Ditetapkan. Harap tetapkan pagu anggaran terlebih dahulu sebelum melaporkan penggunaan anggaran.",
                confirmText: "Mengerti",
                variant: "destructive",
                onConfirm: () => { }
            })
            // Close the update dialog so they can see the button to set budget
            setIsUpdateOpen(false)
            return
        }

        const newUsed = reportData.budget.used + budgetAmount
        const currentTotal = reportData.budget.total

        // If total is 0, percentage is 0 to avoid division by zero
        const newPercentage = currentTotal > 0 ? (newUsed / currentTotal) * 100 : 0

        const newItem = {
            date: "20 Agu 2024", // Mock date
            title: "Update Progress Dinas",
            description: progressDesc,
            status: "in_progress" as const,
            budgetUsed: budgetAmount > 0 ? `Penggunaan Anggaran: ${formatCurrency(budgetAmount)}` : undefined,
            images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"]
        } as any

        setReportData(prev => ({
            ...prev,
            budget: {
                ...prev.budget,
                used: newUsed,
                percentage: parseFloat(newPercentage.toFixed(1))
            },
            timeline: [newItem, ...prev.timeline]
        }))

        setIsUpdateOpen(false)
        setProgressDesc("")
        setProgressBudget("")
    }

    const handleCompleteReport = () => {
        // Logic to complete report
        router.push("/dinas/laporan/selesai")
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
                <Link href="/dinas/laporan/progress">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Detail Laporan #{id}</h2>
                    <p className="text-muted-foreground">
                        Pantau dan update perkembangan penanganan laporan.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Report Details (Takes up 2 columns) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="overflow-hidden border-border/60 shadow-sm p-0 gap-0">
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

                {/* Right Column - Actions, Budget, Timeline */}
                <div className="space-y-6">
                    {/* Action Card */}
                    <Card className="border-blue-100 bg-blue-50/50">
                        <CardHeader>
                            <CardTitle className="text-base text-blue-900">Tindakan Dinas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Budget Setting / Revision Dialog */}
                            <Dialog
                                open={isBudgetOpen}
                                onOpenChange={(open) => {
                                    setIsBudgetOpen(open)
                                    if (open && reportData.budget.total > 0) {
                                        setInitialBudgetInput(reportData.budget.total.toString())
                                    } else if (open) {
                                        setInitialBudgetInput("")
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        className={`w-full mb-2 ${reportData.budget.total > 0
                                            ? "bg-amber-100 text-amber-900 override:hover:bg-amber-200 border-amber-200 shadow-sm border"
                                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                            }`}
                                        variant={reportData.budget.total > 0 ? "secondary" : "default"}
                                    >
                                        <DollarSign className="mr-2 h-4 w-4" />
                                        {reportData.budget.total > 0 ? "Revisi Pagu Anggaran" : "Tetapkan Pagu Anggaran"}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {reportData.budget.total > 0 ? "Revisi Pagu Anggaran" : "Tetapkan Pagu Anggaran"}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {reportData.budget.total > 0
                                                ? "Perbarui batas atas anggaran untuk proyek ini."
                                                : "Tentukan batas atas anggaran untuk proyek perbaikan ini."}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Total Pagu Anggaran (Rp)</Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    className="pl-8"
                                                    placeholder="Contoh: 100.000.000"
                                                    value={initialBudgetInput}
                                                    onChange={(e) => setInitialBudgetInput(e.target.value)}
                                                />
                                            </div>
                                            <p className="text-[0.8rem] text-muted-foreground">
                                                Anggaran ini bisa direvisi nanti jika diperlukan.
                                            </p>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsBudgetOpen(false)}>Batal</Button>
                                        <Button onClick={handleSetBudget}>Simpan Pagu</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Update Progress & Anggaran
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Update Progress Pengerjaan</DialogTitle>
                                        <DialogDescription>
                                            Laporkan perkembangan terbaru dan anggaran yang digunakan.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Deskripsi Pengerjaan</Label>
                                            <Textarea
                                                placeholder="Jelaskan apa yang telah dikerjakan..."
                                                value={progressDesc}
                                                onChange={(e) => setProgressDesc(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Anggaran Terpakai (Opsional)</Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    className="pl-8"
                                                    placeholder="Contoh: 15.000.000"
                                                    value={progressBudget}
                                                    onChange={(e) => setProgressBudget(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Foto Dokumentasi</Label>
                                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                                                <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                                                <p className="text-xs text-muted-foreground">Klik untuk upload foto</p>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>Batal</Button>
                                        <Button onClick={handleUpdateProgress}>Simpan Update</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full bg-green-600 hover:bg-green-700">
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Selesaikan Laporan
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Selesaikan Laporan</DialogTitle>
                                        <DialogDescription>
                                            Konfirmasi bahwa pengerjaan telah selesai sepenuhnya.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Laporan Penyelesaian</Label>
                                            <Textarea
                                                placeholder="Ringkasan hasil pengerjaan..."
                                                value={completionDesc}
                                                onChange={(e) => setCompletionDesc(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Foto Bukti Selesai (Wajib)</Label>
                                            <div className="border-2 border-dashed border-green-200 bg-green-50/50 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-green-100/50 transition-colors">
                                                <Camera className="h-8 w-8 text-green-600 mb-2" />
                                                <p className="text-xs text-green-700">Upload bukti foto selesai</p>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsCompleteOpen(false)}>Batal</Button>
                                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleCompleteReport}>Konfirmasi Selesai</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

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

                    {/* Timeline */}
                    <ReportTimeline timeline={reportData.timeline} />

                    {/* Budget */}
                    {reportData.budget.total > 0 && (
                        <BudgetTransparency
                            budget={{
                                total: formatCurrency(reportData.budget.total),
                                used: formatCurrency(reportData.budget.used),
                                percentage: reportData.budget.percentage
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
