"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Report } from "@/lib/data";
import { Calendar, MapPin, Share2, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ReportInfoProps {
    report: Report;
}

export function ReportInfo({ report }: ReportInfoProps) {
    const [isSupported, setIsSupported] = useState(false);
    const [count, setCount] = useState(report.supportCount);

    const handleSupport = () => {
        if (isSupported) {
            setCount(prev => prev - 1);
            setIsSupported(false);
        } else {
            setCount(prev => prev + 1);
            setIsSupported(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
                <Image
                    src={report.image}
                    alt={report.title}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <div>
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none mb-3">
                    In Progress
                </Badge>
                <h1 className="text-2xl font-bold text-[#1e293b] mb-4">
                    {report.title}
                </h1>

                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                            <report.icon className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Kategori</p>
                            <p className="text-sm font-semibold text-[#1e293b]">{report.category}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Lokasi</p>
                            <p className="text-sm font-semibold text-[#1e293b]">{report.fullAddress}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Dilaporkan Pada</p>
                            <p className="text-sm font-semibold text-[#1e293b]">{report.date}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Card className="border-gray-100 bg-blue-50/50">
                <CardContent className="p-6">
                    <h3 className="font-bold text-[#1e293b] mb-2">Dukung Laporan Ini</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Dukungan Anda membantu mempercepat prioritas perbaikan masalah ini.
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-blue-600">{count}</span>
                        <span className="text-sm text-gray-500 font-medium">Warga Mendukung</span>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={handleSupport}
                            className={`flex-1 shadow-lg transition-all ${isSupported
                                    ? "bg-blue-800 hover:bg-blue-900 text-white shadow-blue-800/20"
                                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                                }`}
                        >
                            <ThumbsUp className={`w-4 h-4 mr-2 ${isSupported ? "fill-current" : ""}`} />
                            {isSupported ? "Didukung" : "Beri Dukungan"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
