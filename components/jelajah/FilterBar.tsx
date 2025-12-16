"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function FilterBar() {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Cari berdasarkan lokasi atau jenis masalah..."
                    className="pl-10 h-11 bg-white border-gray-200 focus-visible:ring-blue-500 rounded-xl"
                />
            </div>
            <div className="flex gap-4">
                <Select>
                    <SelectTrigger className="w-full md:w-[180px] h-11 bg-white border-gray-200 rounded-xl">
                        <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        <SelectItem value="infrastruktur">Infrastruktur</SelectItem>
                        <SelectItem value="lingkungan">Lingkungan</SelectItem>
                        <SelectItem value="sosial">Sosial</SelectItem>
                    </SelectContent>
                </Select>
                <Select defaultValue="terbanyak">
                    <SelectTrigger className="w-full md:w-[200px] h-11 bg-white border-gray-200 rounded-xl">
                        <SelectValue placeholder="Urutkan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="terbanyak">Dukungan Terbanyak</SelectItem>
                        <SelectItem value="terbaru">Laporan Terbaru</SelectItem>
                        <SelectItem value="mendesak">Paling Mendesak</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
