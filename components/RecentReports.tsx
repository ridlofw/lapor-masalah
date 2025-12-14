import { MapPin, AlertCircle, Droplets, Lightbulb } from "lucide-react";

const reports = [
    {
        id: 1,
        category: "Jalan Rusak Parah",
        date: "12 Okt 2023",
        location: "Desa Sukamaju, RW 05",
        status: "Diproses",
        icon: AlertCircle,
        color: "bg-slate-100 text-slate-600",
    },
    {
        id: 2,
        category: "Saluran Air Mampet",
        date: "10 Okt 2023",
        location: "Pasar Lama, Blok C",
        status: "Menunggu",
        icon: Droplets,
        color: "bg-blue-50 text-blue-600",
    },
    {
        id: 3,
        category: "Lampu Jalan Mati",
        date: "05 Okt 2023",
        location: "Jl. Merdeka No. 45",
        status: "Selesai",
        icon: Lightbulb,
        color: "bg-yellow-50 text-yellow-600",
    },
];

export default function RecentReports() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="font-semibold text-lg text-slate-800">Laporan Terbaru</h2>
                <button className="text-sm text-slate-400 hover:text-slate-600">Lihat Semua</button>
            </div>

            <div className="p-0">
                <div className="grid grid-cols-12 px-6 py-3 bg-gray-50/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <div className="col-span-5">Kategori</div>
                    <div className="col-span-4">Lokasi</div>
                    <div className="col-span-3">Status</div>
                </div>

                <div className="divide-y divide-gray-50">
                    {reports.map((report) => (
                        <div key={report.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors cursor-pointer group">
                            <div className="col-span-5 flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full ${report.color} flex items-center justify-center shrink-0`}>
                                    <report.icon size={18} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{report.category}</h4>
                                    <p className="text-xs text-slate-400">{report.date}</p>
                                </div>
                            </div>
                            <div className="col-span-4 text-sm text-slate-600 flex items-center gap-2">
                                <MapPin size={14} className="text-slate-400" />
                                {report.location}
                            </div>
                            <div className="col-span-3 flex items-center justify-between">
                                <span className={`
                  px-3 py-1 rounded-full text-xs font-medium border
                  ${report.status === 'Diproses' ? 'bg-blue-50 text-blue-600 border-blue-100' : ''}
                  ${report.status === 'Menunggu' ? 'bg-orange-50 text-orange-600 border-orange-100' : ''}
                  ${report.status === 'Selesai' ? 'bg-green-50 text-green-600 border-green-100' : ''}
                `}>
                                    {report.status}
                                </span>
                                <span className="text-slate-300 group-hover:text-blue-500">→</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
