import { LucideIcon } from "lucide-react";

export type ReportCategory = "Jalan" | "Jembatan" | "Sekolah" | "Kesehatan" | "Air" | "Listrik";
export type ReportStatus = "Selesai" | "Diproses" | "Menunggu" | "Ditolak";

export interface TimelineItem {
    date: string;
    title: string;
    description: string;
    images?: string[];
    budgetUsed?: string;
    status: "completed" | "in_progress" | "pending";
}

export interface ReportBudget {
    total: string;
    used: string;
    percentage: number;
}

export interface Report {
    id: string;
    title: string;
    category: ReportCategory;
    date: string;
    location: string;
    fullAddress: string;
    status: ReportStatus;
    statusColor: string;
    icon: LucideIcon;
    description: string;
    image: string;
    additionalImages?: string[];
    supportCount: number;
    timeline: TimelineItem[];
    budget?: ReportBudget | null;
    rejectionReason?: string | null;
    reporter: string;
    isMyReport?: boolean;
    coordinates?: { lat: number; lng: number };
}
