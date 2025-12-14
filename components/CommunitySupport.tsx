
import { ChevronUp } from "lucide-react";

export default function CommunitySupport() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg text-slate-800">Dukungan Komunitas</h2>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-wider">Popular</span>
            </div>

            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                        <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                            <ChevronUp size={18} />
                        </button>
                        <span className="text-sm font-bold text-slate-700">54</span>
                    </div>
                    <div>
                        <h3 className="font-medium text-slate-800 text-sm leading-snug mb-1">
                            Jembatan Putus Akibat Banjir Bandang
                        </h3>
                        <p className="text-xs text-slate-400">• Desa Semarung</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                        <button className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                            <ChevronUp size={18} />
                        </button>
                        <span className="text-sm font-bold text-slate-700">32</span>
                    </div>
                    <div>
                        <h3 className="font-medium text-slate-800 text-sm leading-snug mb-1">
                            Tiang Listrik Miring di Jalan Poros
                        </h3>
                        <p className="text-xs text-slate-400">• Jalan Poros Utama</p>
                    </div>
                </div>
            </div>

            <button className="w-full mt-8 py-3 px-4 border border-gray-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Jelajah Laporan Lainnya
            </button>
        </div>
    );
}
