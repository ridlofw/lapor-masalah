"use client";

import Image from "next/image";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowBigUp, MapPin, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReportCardProps {
    id: string | number;
    title: string;
    image: string;
    location: string;
    category: string;
    description: string;
    status: "Menunggu Verifikasi" | "Diproses" | "Selesai" | "Ditolak" | "Baru";
    date: string;
    author: {
        name: string;
        avatar: string;
        role: string;
    };
    supportCount: number;
    timeAgo: string;
}

export function ReportCard(props: ReportCardProps) {
    const router = useRouter();
    const {
        title,
        image,
        location,
        status,
        author,
        supportCount,
        timeAgo,
        id
    } = props;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Menunggu Verifikasi":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Diproses":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "Selesai":
                return "bg-green-100 text-green-700 border-green-200";
            case "Baru":
                return "bg-gray-100 text-gray-700 border-gray-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <Card className="group hover:shadow-lg transition-shadow cursor-pointer h-full border-gray-200 overflow-hidden p-0 gap-0" onClick={() => router.push(`/laporan/${id}`)}>
            <div className="relative aspect-video w-full overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                    <Badge className={`hover:bg-opacity-100 ${getStatusColor(status)} shadow-sm`}>
                        {status === 'Selesai' && <span className="mr-1">✓</span>}
                        {status === 'Baru' && <span className="mr-1">●</span>}
                        {status}
                    </Badge>
                </div>
            </div>
            <CardContent className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-[#1e293b] text-base mb-2 line-clamp-2">
                    {title}
                </h3>

                <div className="flex items-center text-gray-500 text-xs mb-4">
                    <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
                    <span className="line-clamp-1">{location}</span>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-auto">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={author.avatar} />
                            <AvatarFallback>{author.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">{timeAgo}</span>
                    </div>

                    {status === "Selesai" ? (
                        <div className="flex items-center text-green-600 text-xs font-medium">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Telah Diperbaiki
                        </div>
                    ) : (
                        <Button
                            variant={status === "Diproses" ? "default" : "secondary"}
                            size="sm"
                            className={`h-8 text-xs font-medium ${status === "Diproses" ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-sm" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                        >
                            <ArrowBigUp className="h-4 w-4 mr-1.5" />
                            {supportCount}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
