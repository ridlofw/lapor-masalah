import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import RecentReports from "@/components/RecentReports";
import CommunitySupport from "@/components/CommunitySupport";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-500">
              Pantau status laporan infrastruktur Anda dan lihat update terbaru dari komunitas sekitar.
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm hover:shadow transition-all">
            <Plus size={18} />
            Buat Laporan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Laporan"
            count={12}
            subtitle="+2 laporan baru bulan ini"
            iconType="wallet"
          />
          <StatsCard
            title="Dalam Proses"
            count={3}
            subtitle="Sedang ditinjau oleh dinas terkait"
            iconType="process"
          />
          <StatsCard
            title="Selesai"
            count={8}
            subtitle="Laporan berhasil diselesaikan"
            iconType="done"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentReports />
          </div>
          <div className="lg:col-span-1">
            <CommunitySupport />
          </div>
        </div>
      </main>
    </div>
  );
}
