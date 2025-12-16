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
} from "lucide-react";
import { useState, useMemo } from "react";

// Mock Data
const INITIAL_REPORTS = [
    {
        id: "#LM-2023-001",
        category: "Jalan Rusak",
        location: "Desa Suka Maju, NTT",
        date: "2023-10-12",
        status: "Diproses",
        statusColor: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    },
    {
        id: "#LM-2023-002",
        category: "Listrik Mati",
        location: "Desa Won Raba, NTT",
        date: "2023-10-10",
        status: "Selesai",
        statusColor: "bg-green-100 text-green-700 hover:bg-green-100",
    },
    {
        id: "#LM-2023-003",
        category: "Jembatan Roboh",
        location: "Kec. Alor, NTT",
        date: "2023-10-05",
        status: "Menunggu",
        statusColor: "bg-gray-100 text-gray-700 hover:bg-gray-100",
    },
    {
        id: "#LM-2023-004",
        category: "Air Bersih",
        location: "Desa Bena, NTT",
        date: "2023-10-01",
        status: "Selesai",
        statusColor: "bg-green-100 text-green-700 hover:bg-green-100",
    },
    {
        id: "#LM-2023-005",
        category: "Sekolah Rusak",
        location: "Pulau Rote, NTT",
        date: "2023-09-28",
        status: "Diproses",
        statusColor: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    },
    {
        id: "#LM-2023-006",
        category: "Jalan Rusak",
        location: "Desa Oeteta, NTT",
        date: "2023-09-25",
        status: "Menunggu",
        statusColor: "bg-gray-100 text-gray-700 hover:bg-gray-100",
    },
    {
        id: "#LM-2023-007",
        category: "Air Bersih",
        location: "Desa Mamboro, NTT",
        date: "2023-09-20",
        status: "Selesai",
        statusColor: "bg-green-100 text-green-700 hover:bg-green-100",
    },
    {
        id: "#LM-2023-008",
        category: "Listrik Mati",
        location: "Desa Baumata, NTT",
        date: "2023-09-18",
        status: "Diproses",
        statusColor: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    },
    {
        id: "#LM-2023-009",
        category: "Jalan Rusak",
        location: "Kota Kupang, NTT",
        date: "2023-09-15",
        status: "Selesai",
        statusColor: "bg-green-100 text-green-700 hover:bg-green-100",
    },
    {
        id: "#LM-2023-010",
        category: "Sekolah Rusak",
        location: "Kab. TTS, NTT",
        date: "2023-09-10",
        status: "Menunggu",
        statusColor: "bg-gray-100 text-gray-700 hover:bg-gray-100",
    },
    {
        id: "#LM-2023-011",
        category: "Jembatan Roboh",
        location: "Kab. TTU, NTT",
        date: "2023-09-05",
        status: "Selesai",
        statusColor: "bg-green-100 text-green-700 hover:bg-green-100",
    },
    {
        id: "#LM-2023-012",
        category: "Air Bersih",
        location: "Kab. Belu, NTT",
        date: "2023-09-01",
        status: "Diproses",
        statusColor: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    },
];

type SortConfig = {
    key: keyof typeof INITIAL_REPORTS[0] | null;
    direction: 'asc' | 'desc';
};

import { useRouter } from "next/navigation";

export default function LaporanSaya() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

    // Filter and Sort Data
    const filteredData = useMemo(() => {
        let result = [...INITIAL_REPORTS];

        // Filter by Search
        if (searchTerm) {
            result = result.filter(
                (item) =>
                    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by Status
        if (statusFilter !== "all") {
            result = result.filter(
                (item) => item.status.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        // Sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key!] < b[sortConfig.key!]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key!] > b[sortConfig.key!]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [searchTerm, statusFilter, sortConfig]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleSort = (key: keyof typeof INITIAL_REPORTS[0]) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

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

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <StatsCard
                        title="TOTAL LAPORAN"
                        value="12"
                        icon={Folder}
                        iconClassName="text-gray-400"
                    />
                    <StatsCard
                        title="DIPROSES"
                        value="5"
                        icon={Loader2}
                        iconClassName="text-blue-500"
                        valueClassName="text-blue-500"
                    />
                    <StatsCard
                        title="SELESAI"
                        value="7"
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
                                placeholder="Cari ID Laporan atau Lokasi..."
                                className="pl-9 border-0 bg-transparent shadow-none focus-visible:ring-0 h-10 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block h-8 w-px bg-gray-200 mx-2" />

                        <div className="w-full md:w-auto min-w-[200px]">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead
                                        className="w-[180px] font-semibold text-[#1e293b] cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => handleSort('id')}
                                    >
                                        <div className="flex items-center gap-2">
                                            ID Laporan
                                            <ArrowUpDown className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="font-semibold text-[#1e293b] cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => handleSort('category')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Kategori
                                            <ArrowUpDown className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="font-semibold text-[#1e293b] cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => handleSort('location')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Lokasi
                                            <ArrowUpDown className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="font-semibold text-[#1e293b] cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => handleSort('date')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Tanggal
                                            <ArrowUpDown className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-[#1e293b]">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-[#1e293b]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((report) => (
                                        <TableRow key={report.id} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="font-medium text-gray-600">
                                                {report.id}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-[#1e293b]">
                                                    {report.category === "Jalan Rusak" || report.category === "Jembatan Roboh" ? <div className="h-2 w-2 rounded-full bg-red-400" /> :
                                                        report.category === "Listrik Mati" ? <div className="h-2 w-2 rounded-full bg-yellow-400" /> :
                                                            report.category === "Air Bersih" ? <div className="h-2 w-2 rounded-full bg-blue-400" /> :
                                                                <div className="h-2 w-2 rounded-full bg-gray-400" />
                                                    }
                                                    {report.category}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{report.location}</TableCell>
                                            <TableCell className="text-gray-600">{formatDate(report.date)}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={`${report.statusColor} font-medium border-0 px-3 py-1`}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                        {report.status}
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
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            Tidak ada data laporan yang ditemukan.
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
                                <span>dari <span className="font-medium text-[#1e293b]">{filteredData.length}</span> hasil</span>
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
            </main>
        </div>
    );
}
