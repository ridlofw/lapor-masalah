// API Configuration
// Change this URL when deploying to production

// For development: Use your computer's local IP address
// Find it by running `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
// Example: "http://192.168.1.100:3000"

// For production: Use your deployed website URL
// Example: "https://lapor-masalah.vercel.app"
export const API_URL = "https://lapor-masalah.vercel.app";

// DEVELOPMENT MODE
// export const API_URL = "http://192.168.1.20:3000";

// Uncomment this for production:
// export const API_URL = "https://your-deployed-website.vercel.app";

// Theme colors - Blue theme matching website
export const COLORS = {
    primary: "#3B82F6",      // Blue-500
    primaryDark: "#2563EB",  // Blue-600
    primaryLight: "#60A5FA", // Blue-400
    secondary: "#8B5CF6",    // Violet-500
    background: "#F9FAFB",
    white: "#FFFFFF",
    gray: {
        50: "#F9FAFB",
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D1D5DB",
        400: "#9CA3AF",
        500: "#6B7280",
        600: "#4B5563",
        700: "#374151",
        800: "#1F2937",
        900: "#111827",
    },
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
};

export const REPORT_CATEGORIES = [
    { value: "JALAN", label: "Jalan", icon: "🛣️" },
    { value: "JEMBATAN", label: "Jembatan", icon: "🌉" },
    { value: "SEKOLAH", label: "Sekolah", icon: "🏫" },
    { value: "KESEHATAN", label: "Kesehatan", icon: "🏥" },
    { value: "AIR", label: "Air", icon: "💧" },
    { value: "LISTRIK", label: "Listrik", icon: "⚡" },
] as const;

export type ReportCategory = (typeof REPORT_CATEGORIES)[number]["value"];

export const REPORT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
    MENUNGGU_VERIFIKASI: { label: "Menunggu", color: "bg-yellow-100 text-yellow-800" },
    DIDISPOSISIKAN: { label: "Didisposisikan", color: "bg-blue-100 text-blue-800" },
    DIVERIFIKASI_DINAS: { label: "Diverifikasi", color: "bg-indigo-100 text-indigo-800" },
    DALAM_PENGERJAAN: { label: "Dalam Pengerjaan", color: "bg-purple-100 text-purple-800" },
    SELESAI: { label: "Selesai", color: "bg-green-100 text-green-800" },
    DITOLAK: { label: "Ditolak", color: "bg-red-100 text-red-800" },
    DITOLAK_DINAS: { label: "Ditolak Dinas", color: "bg-red-100 text-red-800" },
};

export const REPORT_STATUSES = [
    { value: "MENUNGGU_VERIFIKASI", label: "Menunggu" },
    { value: "DIDISPOSISIKAN", label: "Diproses" },
    { value: "SELESAI", label: "Selesai" },
    { value: "DITOLAK", label: "Ditolak" },
];
