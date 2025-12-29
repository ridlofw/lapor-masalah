import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ReportCategory } from "./types"
import {
  Droplets,
  HeartPulse,
  Home,
  Lightbulb,
  Pickaxe,
  School,
  LucideIcon
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCategoryIcon = (category: ReportCategory): LucideIcon => {
  switch (category) {
    case "Jalan": return Pickaxe;
    case "Jembatan": return Pickaxe;
    case "Sekolah": return School;
    case "Kesehatan": return HeartPulse;
    case "Air": return Droplets;
    case "Listrik": return Lightbulb;
    default: return Home;
  }
};
