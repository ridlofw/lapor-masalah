
import { Wallet, FolderClock, CheckCircle2 } from "lucide-react";

interface StatsCardProps {
    title: string;
    count: number;
    subtitle: string;
    iconType: "wallet" | "process" | "done";
}

export default function StatsCard({ title, count, subtitle, iconType }: StatsCardProps) {
    let Icon = Wallet;
    let colorClass = "text-slate-400";

    if (iconType === "process") {
        Icon = FolderClock;
        colorClass = "text-blue-500";
    } else if (iconType === "done") {
        Icon = CheckCircle2;
        colorClass = "text-green-500";
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-slate-500">{title}</h3>
                <Icon className={`w-5 h-5 ${colorClass}`} />
            </div>
            <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{count}</div>
                <p className="text-sm text-slate-400">{subtitle}</p>
            </div>
        </div>
    );
}
