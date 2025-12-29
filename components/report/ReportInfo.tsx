"use client";


import { Badge } from "@/components/ui/badge";
import { Report } from "@/lib/types";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ZoomableImage } from "@/components/ui/zoomable-image";

interface ReportInfoProps {
    report: Report;
}

export function ReportInfo({ report }: ReportInfoProps) {
    // Combine main image with additional images
    const allImages = [report.image, ...(report.additionalImages || [])];
    const [selectedImage, setSelectedImage] = useState(allImages[0]);


    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {/* Main View */}
                <ZoomableImage
                    src={selectedImage}
                    alt={report.title}
                    className="rounded-xl bg-gray-100 border border-gray-100"
                />

                {/* Thumbnails */}
                {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                        {allImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${selectedImage === img ? "border-blue-600 ring-2 ring-blue-100" : "border-transparent hover:border-gray-200"
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`View ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <Badge className={`${report.statusColor} hover:${report.statusColor} border-none mb-3`}>
                    {report.status}
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
        </div>
    );
}
