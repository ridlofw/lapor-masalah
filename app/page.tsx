
import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ReportList } from "@/components/dashboard/ReportList";
import { CommunityWidget } from "@/components/dashboard/CommunityWidget";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, FileText, Folder, Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Dashboard Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1e293b]">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Pantau status laporan infrastruktur Anda dan lihat update terbaru dari komunitas sekitar.
            </p>
          </div>
          <Link href="/lapor">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm shadow-blue-200">
              <Plus className="h-4 w-4" />
              Buat Laporan
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Laporan"
            value="12"
            description="+2 laporan baru bulan ini"
            icon={Folder}
            iconClassName="text-gray-400"
          />
          <StatsCard
            title="Dalam Proses"
            value="3"
            description="Sedang ditinjau oleh dinas terkait"
            icon={FileText}
            iconClassName="text-blue-500"
          />
          <StatsCard
            title="Selesai"
            value="8"
            description="Laporan berhasil diselesaikan"
            icon={CheckCircle2}
            iconClassName="text-green-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-full">
            <ReportList />
          </div>
          <div className="lg:col-span-1 h-full">
            <CommunityWidget />
          </div>
        </div>
      </main>
    </div>
  );
}
