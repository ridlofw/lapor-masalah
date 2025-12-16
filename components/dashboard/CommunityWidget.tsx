
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowBigUp, MapPin } from "lucide-react";

const communityReports = [
    {
        id: 1,
        title: "Jembatan Putus Akibat Banjir Bandang",
        location: "Desa Seberang",
        votes: 54,
    },
    {
        id: 2,
        title: "Tiang Listrik Miring di Jalan Poros",
        location: "Jalan Poros Utama",
        votes: 32,
    },
];

export function CommunityWidget() {
    return (
        <Card className="border-gray-100 shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-bold text-[#1e293b]">Dukungan Komunitas</CardTitle>
                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase tracking-wider">
                    Popular
                </span>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                    {communityReports.map((report) => (
                        <div key={report.id} className="flex gap-3">
                            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-1 min-w-[2.5rem] h-[3.5rem]">
                                <ArrowBigUp className="h-5 w-5 text-gray-400" />
                                <span className="text-xs font-bold text-[#1e293b] mt-0.5">{report.votes}</span>
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-semibold text-sm text-[#1e293b] leading-tight">
                                    {report.title}
                                </h4>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <MapPin className="h-3 w-3" />
                                    <span>{report.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Link href="/jelajah" className="w-full mt-4">
                    <Button variant="outline" className="w-full text-[#1e293b] border-gray-200 hover:bg-gray-50 hover:text-[#1e293b]">
                        Jelajah Laporan Lainnya
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
