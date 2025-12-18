"use client";

import { Search, Filter, AlignLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
    search: string;
    setSearch: (value: string) => void;
    category: string;
    setCategory: (value: string) => void;
    sort: string;
    setSort: (value: string) => void;
}

export function FilterBar({ search, setSearch, category, setCategory, sort, setSort }: FilterBarProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Cari berdasarkan lokasi atau jenis masalah..."
                    className="pl-10 !h-11 bg-white border-gray-200 focus-visible:ring-blue-500 rounded-xl"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex gap-4">
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full md:w-[200px] !h-11 bg-white border-gray-200 rounded-xl text-gray-600">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Filter className="h-4 w-4" />
                            <SelectValue placeholder="Semua Kategori" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        <SelectItem value="Jalan">Jalan</SelectItem>
                        <SelectItem value="Jembatan">Jembatan</SelectItem>
                        <SelectItem value="Sekolah">Sekolah</SelectItem>
                        <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                        <SelectItem value="Air">Air</SelectItem>
                        <SelectItem value="Listrik">Listrik</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-full md:w-[200px] !h-11 bg-white border-gray-200 rounded-xl text-gray-600">
                        <div className="flex items-center gap-2 text-gray-600">
                            <AlignLeft className="h-4 w-4" />
                            <SelectValue placeholder="Urutkan" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="terbanyak">Dukungan Terbanyak</SelectItem>
                        <SelectItem value="terbaru">Laporan Terbaru</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
