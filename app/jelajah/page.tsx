"use client";

import { Header } from "@/components/dashboard/Header";
import Link from "next/link";
import { FilterBar } from "@/components/jelajah/FilterBar";
import { ReportsGrid } from "@/components/jelajah/ReportsGrid";
import { Pagination } from "@/components/jelajah/Pagination";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function JelajahPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />

            <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
                            Jelajah Laporan Warga
                        </h1>
                        <p className="text-gray-500">
                            Pantau dan dukung perbaikan infrastruktur di daerah 3T.
                        </p>
                    </div>

                    <Link href="/lapor">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-11 px-6 rounded-xl shadow-lg shadow-blue-600/20">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Buat Laporan Baru
                        </Button>
                    </Link>
                </div>

                <FilterBar />

                <ReportsGrid />

                <Pagination />
            </main>
        </div>
    );
}
