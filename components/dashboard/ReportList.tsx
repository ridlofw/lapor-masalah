"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ChevronRight,
    Droplets,
    Lightbulb,
    Pickaxe,
} from "lucide-react";
import Link from "next/link";

import { reports } from "@/lib/data";

import { useRouter } from "next/navigation";

export function ReportList() {
    const router = useRouter();
    return (
        <Card className="border-gray-100 shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-bold text-[#1e293b]">
                    Laporan Terbaru
                </CardTitle>
                <Link
                    href="/jelajah"
                    className="text-sm font-medium text-gray-400 hover:text-[#1e293b] transition-colors"
                >
                    Lihat Semua
                </Link>
            </CardHeader>
            <CardContent className="pt-0 flex-1 p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-gray-100">
                            <TableHead className="w-[40%] pl-4">Kategori</TableHead>
                            <TableHead className="hidden md:table-cell">Lokasi</TableHead>
                            <TableHead className="text-right pr-6">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow
                                key={report.id}
                                className="hover:bg-gray-50/50 border-gray-100 cursor-pointer group"
                                onClick={() => router.push(`/laporan/${report.id}`)}
                            >
                                <TableCell className="pl-4 py-3">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                            <report.icon className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-[#1e293b] line-clamp-1">
                                                {report.category}
                                            </h4>
                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                {report.date}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-sm text-gray-500 font-medium">
                                    {report.location}
                                </TableCell>
                                <TableCell className="text-right pr-6 py-4">
                                    <div className="flex items-center justify-end gap-3">
                                        <Badge
                                            variant="outline"
                                            className={`px-3 py-1 text-xs font-semibold rounded-full border ${report.statusColor}`}
                                        >
                                            {report.status}
                                        </Badge>
                                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 transition-colors hidden md:block" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
