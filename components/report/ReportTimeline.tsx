import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimelineItem } from "@/lib/data";
import { CheckCircle2, Clock, FileText, Send } from "lucide-react";
import Image from "next/image";
import { ZoomableImage } from "@/components/ui/zoomable-image";

interface ReportTimelineProps {
    timeline: TimelineItem[];
}

export function ReportTimeline({ timeline }: ReportTimelineProps) {
    // Helper to determine icon based on title or other logic
    const getIcon = (item: TimelineItem) => {
        if (item.title.includes("Selesai") || item.title.includes("Verifikasi")) return CheckCircle2;
        if (item.title.includes("Diteruskan")) return Send;
        if (item.title.includes("Dibuat")) return FileText;
        return Clock;
    };

    return (
        <Card className="border-gray-100 shadow-sm h-fit">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-[#1e293b]">
                    Riwayat Penanganan Laporan
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative pl-4 space-y-8">
                    {/* Vertical Line */}
                    <div className="absolute top-0 bottom-0 left-[28px] w-px bg-gray-200" />

                    {timeline.map((item, index) => {
                        const Icon = getIcon(item);
                        const isLatest = index === 0;

                        return (
                            <div key={index} className="relative flex items-start gap-4">
                                {/* Icon Logic */}
                                <div className={`
                                flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center z-10 ring-4 ring-white
                                ${isLatest ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}
                            `}>
                                    <Icon className="w-3.5 h-3.5" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-0.5">
                                    <div className="text-xs text-gray-400 font-medium mb-1">
                                        {item.date}
                                    </div>
                                    <h3 className={`font-bold text-[#1e293b] mb-2 ${isLatest ? 'text-base' : 'text-sm'}`}>
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {item.description}
                                    </p>

                                    {/* Images if any */}
                                    {item.images && item.images.length > 0 && (
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            {item.images.map((img, i) => (
                                                <ZoomableImage
                                                    key={i}
                                                    src={img}
                                                    alt={`Evidence ${i}`}
                                                    className="rounded-lg border border-gray-100"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Budget Info in Timeline */}
                                    {item.budgetUsed && (
                                        <div className="mt-3 bg-blue-50/50 rounded-lg p-3 text-xs font-medium text-blue-700 border border-blue-100">
                                            {item.budgetUsed}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
