"use client";

import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CheckCircle2,
    FileText,
    Folder,
    Loader2,
    Plus,
    Search,
    ArrowRight,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Filter,
    Lock,
    LogIn,
    XCircle,
    Activity
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";

export default function LaporanSaya() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    // Data States
    const [reports, setReports] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0 });
    const [loadingData, setLoadingData] = useState(true);

    // Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const totalPages = Math.ceil(totalItems / rowsPerPage);

    useEffect(() => {
        if (!user) return;

        // Fetch Stats
        fetch('/api/reports/mine/stats')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setStats(data);
            })
            .catch(err => console.error("Stats fetch error:", err));

    }, [user]);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setLoadingData(true);
            try {
                const params = new URLSearchParams();
                params.set('page', currentPage.toString());
                params.set('limit', rowsPerPage.toString());
                if (statusFilter !== 'all') params.set('status', statusFilter);
                if (searchTerm) params.set('search', searchTerm);

                const res = await fetch(`/api/reports/mine?${params.toString()}`);
                const data = await res.json();

                if (data.reports) {
                    setReports(data.reports);
                    setTotalItems(data.pagination.total);
                    // Adjust page if out of bounds
                    if (currentPage > 1 && data.reports.length === 0 && data.pagination.total > 0) {
                        setCurrentPage(Math.max(1, Math.ceil(data.pagination.total / rowsPerPage)));
                    }
                }
            } catch (error) {
                console.error("Reports fetch error:", error);
            } finally {
                setLoadingData(false);
            }
        };

        const timeout = setTimeout(fetchData, 300); // 300ms debounce
        return () => clearTimeout(timeout);

    }, [user, currentPage, rowsPerPage, statusFilter, searchTerm]);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "MENUNGGU_VERIFIKASI":
                return { label: "Menunggu", color: "bg-gray-100 text-gray-700", dot: "bg-gray-500" };
            case "DIDISPOSISIKAN":
                return { label: "Didisposisikan", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" };
            case "DIVERIFIKASI_DINAS":
                return { label: "Diverifikasi", color: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500" };
            case "DALAM_PENGERJAAN":
                return { label: "Pengerjaan", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" };
            case "SELESAI":
                return { label: "Selesai", color: "bg-green-100 text-green-700", dot: "bg-green-500" };
            case "DITOLAK":
            case "DITOLAK_DINAS":
                return { label: "Ditolak", color: "bg-red-100 text-red-700", dot: "bg-red-500" };
            default:
                return { label: status, color: "bg-gray-100 text-gray-700", dot: "bg-gray-500" };
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "JALAN": case "JEMBATAN": return "bg-red-400";
            case "LISTRIK": return "bg-yellow-400";
            case "AIR": return "bg-blue-400";
            case "SEKOLAH": case "KESEHATAN": return "bg-green-400";
            default: return "bg-gray-400";
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />

            <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
                {/* Title Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#1e293b]">
                            Riwayat Laporan Anda
                        </h1>
                        <p className="text-gray-500 mt-1 max-w-2xl">
                            Pantau status pengaduan Infrastruktur yang telah Anda kirimkan untuk
                            pembangunan daerah yang lebih baik.
                        </p>
                    </div>
                    <Link href="/lapor">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm shadow-blue-200">
                            <Plus className="h-4 w-4" />
                            Tambah Laporan
                        </Button>
                    </Link>
                </div>

                {!user ? (
                    // GUEST STATE
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm text-center px-4 animate-in fade-in zoom-in-95 duration-500">
                        <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                            <Lock className="h-10 w-10 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1e293b] mb-2">Akses Terbatas</h2>
                        <p className="text-gray-500 max-w-md mb-8">
                            Anda perlu masuk ke akun Anda untuk melihat riwayat laporan yang pernah Anda kirimkan.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/login">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px] gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Masuk
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button variant="outline" className="min-w-[120px]">
                                    Daftar Akun
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    // LOGGED IN STATE
                    <>
                        {/* Stats Cards */}
                        <div className="grid gap-6 md:grid-cols-3">
                            <StatsCard
                                title="TOTAL LAPORAN"
                                value={stats.total.toString()}
                                icon={Folder}
                                iconClassName="text-gray-400"
                            />
                            <StatsCard
                                title="DIPROSES"
                                value={stats.inProgress.toString()}
                                icon={Activity}
                                iconClassName="text-amber-500"
                                valueClassName="text-amber-500"
                            />
                            <StatsCard
                                title="SELESAI"
                                value={stats.completed.toString()}
                                icon={CheckCircle2}
                                iconClassName="text-green-500"
                                valueClassName="text-green-500"
                            />
                        </div>

                        {/* Filters and Table */}
                        <div className="space-y-4">
                            {/* Filters */}
                            <div className="bg-white rounded-xl border shadow-sm p-1.5 flex flex-col md:flex-row items-center gap-2">
                                <div className="relative flex-1 w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari ID Laporan, Lokasi, atau Keterangan..."
                                        className="pl-9 border-0 bg-transparent shadow-none focus-visible:ring-0 h-10 w-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Divider */}
                                <div className="hidden md:block h-8 w-px bg-gray-200 mx-2" />

                                <div className="w-full md:w-auto min-w-[200px]">
                                    <Select value={statusFilter} onValueChange={(val) => {
                                        setStatusFilter(val);
                                        setCurrentPage(1);
                                    }}>
                                        <SelectTrigger className="border-0 shadow-none bg-transparent focus:ring-0 h-10 gap-2 hover:bg-gray-50/50 transition-colors">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Filter className="h-4 w-4" />
                                                <span className="text-sm font-medium">Status:</span>
                                            </div>
                                            <SelectValue placeholder="Semua" />
                                        </SelectTrigger>
                                        <SelectContent align="end">
                                            <SelectItem value="all" className="cursor-pointer">Semua Status</SelectItem>
                                            <SelectItem value="menunggu" className="cursor-pointer">Menunggu</SelectItem>
                                            <SelectItem value="diproses" className="cursor-pointer">Diproses</SelectItem>
                                            <SelectItem value="selesai" className="cursor-pointer">Selesai</SelectItem>
                                            <SelectItem value="ditolak" className="cursor-pointer">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-gray-50/50">
                                        <TableRow>
                                            <TableHead className="w-[180px] font-semibold text-[#1e293b]">ID Laporan</TableHead>
                                            <TableHead className="font-semibold text-[#1e293b]">Kategori</TableHead>
                                            <TableHead className="font-semibold text-[#1e293b]">Lokasi</TableHead>
                                            <TableHead className="font-semibold text-[#1e293b]">Tanggal</TableHead>
                                            <TableHead className="font-semibold text-[#1e293b]">Status</TableHead>
                                            <TableHead className="text-right font-semibold text-[#1e293b]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loadingData ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
                                                    <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></TableCell>
                                                    <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></TableCell>
                                                    <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
                                                    <TableCell><div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" /></TableCell>
                                                    <TableCell><div className="h-8 w-16 bg-gray-200 rounded ml-auto animate-pulse" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : reports.length > 0 ? (
                                            reports.map((report) => {
                                                const info = getStatusInfo(report.status);
                                                const catColor = getCategoryColor(report.category);
                                                return (
                                                    <TableRow key={report.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <TableCell className="font-medium text-gray-600 uppercase">
                                                            #{report.id.slice(0, 8)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2 text-[#1e293b]">
                                                                <div className={`h-2 w-2 rounded-full ${catColor}`} />
                                                                {report.category}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-gray-600 max-w-[200px] truncate" title={report.locationText}>{report.locationText}</TableCell>
                                                        <TableCell className="text-gray-600">{formatDate(report.createdAt)}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="secondary"
                                                                className={`${info.color} font-medium border-0 px-3 py-1`}
                                                            >
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className={`h-1.5 w-1.5 rounded-full ${info.dot}`} />
                                                                    {info.label}
                                                                </div>
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 gap-1"
                                                                onClick={() => router.push(`/laporan/${report.id}`)}
                                                            >
                                                                Detail
                                                                <ArrowRight className="h-3 w-3" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                                                    Tidak ada laporan yang ditemukan.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                {/* Pagination Footer */}
                                <div className="border-t p-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>Menampilkan</span>
                                        <Select
                                            value={rowsPerPage.toString()}
                                            onValueChange={(val) => {
                                                setRowsPerPage(Number(val));
                                                setCurrentPage(1); // Reset to first page
                                            }}
                                        >
                                            <SelectTrigger className="h-8 w-[70px] bg-white border-gray-200">
                                                <SelectValue placeholder={rowsPerPage} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5">5</SelectItem>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span>dari <span className="font-medium text-[#1e293b]">{totalItems}</span> hasil</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="text-sm font-medium text-[#1e293b]">
                                            Hal. {currentPage} dari {Math.max(totalPages, 1)}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            disabled={currentPage === totalPages || totalPages === 0}
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
