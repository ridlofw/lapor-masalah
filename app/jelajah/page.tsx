"use client";

import { Header } from "@/components/dashboard/Header";
import { FilterBar } from "@/components/jelajah/FilterBar";
import { ReportsGrid } from "@/components/jelajah/ReportsGrid";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Pagination } from "@/components/jelajah/Pagination";

export default function JelajahPage() {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("terbaru");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce Search
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchReports();
    }, [debouncedSearch, category, sort, page, limit]);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearch) params.append("search", debouncedSearch);
            if (category && category !== "all") params.append("category", category);
            // Translate sort to API params if supported (currently simplistic)
            if (sort === "terbaru") params.append("sort", "desc");

            params.append("page", page.toString());
            params.append("limit", limit.toString());

            const res = await fetch(`/api/reports?${params.toString()}`);
            const data = await res.json();

            if (data.reports) {
                const mappedReports = data.reports.map((r: any) => ({
                    id: r.id,
                    title: r.description, // Use user description as title
                    image: (r.image && r.image !== "https://images.unsplash.com/photo-1546768292-fb12f6c92568?q=80&w=1350") ? r.image : "/images/no-image-placeholder.png",
                    location: r.locationText,
                    category: r.category,
                    description: r.description,
                    status: mapStatus(r.status),
                    date: new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                    author: {
                        name: r.reporter.name,
                        avatar: r.reporter.avatar || "",
                        role: "Warga"
                    },
                    supportCount: r.supportCount,
                    timeAgo: getTimeAgo(new Date(r.createdAt))
                }));

                setReports(mappedReports);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const mapStatus = (status: string) => {
        switch (status) {
            case "SELESAI": return "Selesai";
            case "MENUNGGU_VERIFIKASI": return "Menunggu Verifikasi";
            case "DIPROSES":
            case "TINDAK_LANJUT": return "Diproses";
            case "DITOLAK": return "Ditolak";
            default: return "Baru";
        }
    }

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " tahun lalu";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " bulan lalu";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " hari lalu";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " jam lalu";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " menit lalu";
        return Math.floor(seconds) + " detik lalu";
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#1e293b] mb-2">Jelajah Laporan</h1>
                    <p className="text-gray-500">Temukan dan dukung laporan dari warga di sekitarmu.</p>
                </div>

                <FilterBar
                    search={search}
                    setSearch={setSearch}
                    category={category}
                    setCategory={setCategory}
                    sort={sort}
                    setSort={setSort}
                />

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <>
                        <ReportsGrid reports={reports} />

                        <div className="mt-8">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                                itemsPerPage={limit}
                                onItemsPerPageChange={(newLimit) => {
                                    setLimit(newLimit);
                                    setPage(1); // Reset to page 1 when limit changes
                                }}
                            />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
