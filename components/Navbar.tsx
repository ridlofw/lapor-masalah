import Link from "next/link";
import { Bell, Search } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-12">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-900 text-white p-1.5 rounded-lg">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    </div>
                    <span className="font-bold text-lg text-slate-800">Lapor Masalah</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href="/dashboard" className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md">
                        Dashboard
                    </Link>
                    <Link href="/laporan-saya" className="hover:text-slate-900">
                        Laporan Saya
                    </Link>
                    <Link href="/jelajah" className="hover:text-slate-900">
                        Jelajah Laporan
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative text-slate-500 hover:text-slate-700">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full translate-x-1/2 -translate-y-1/4 ring-2 ring-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800">Budi Santoso</p>
                        <p className="text-xs text-slate-500">Masyarakat</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
