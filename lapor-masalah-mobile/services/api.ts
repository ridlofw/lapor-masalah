import { API_URL } from "@/constants/config";
import { storage, User } from "@/utils/storage";

export type { User };

export interface ReportImage {
    id: string;
    url: string;
    type: string;
}

export interface TimelineEvent {
    id: string;
    eventType: string;
    title: string;
    description?: string;
    budgetUsed?: string;
    actor?: {
        id: string;
        name: string;
        role: string;
    };
    createdAt: string;
}

export interface ProgressUpdate {
    id: string;
    description: string;
    budgetUsed: string;
    images: string[];
    createdBy: {
        id: string;
        name: string;
    };
    createdAt: string;
}

export interface ReportDetail {
    id: string;
    category: string;
    description: string;
    locationText: string;
    latitude: number;
    longitude: number;
    status: string;
    supportCount: number;
    images: ReportImage[];
    reporter: {
        id: string;
        name: string;
        avatar?: string;
    };
    dinas?: {
        id: string;
        name: string;
        type: string;
    };
    budget?: {
        total: string;
        used: string;
        percentage: number;
    };
    rejectionReason?: string;
    adminNote?: string;
    dinasNote?: string;
    completionNote?: string;
    timeline: TimelineEvent[];
    progress: ProgressUpdate[];
    createdAt: string;
    updatedAt: string;
}

export interface Report {
    id: string;
    category: string;
    description: string;
    locationText: string;
    latitude: number;
    longitude: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    image?: string;
    dinas?: {
        name: string;
        type: string;
    };
}

interface LoginResponse {
    success: boolean;
    user?: User;
    error?: string;
}

interface RegisterResponse {
    success: boolean;
    user?: User;
    error?: string;
}

interface CreateReportResponse {
    success: boolean;
    report?: {
        id: string;
        category: string;
        status: string;
        createdAt: string;
    };
    error?: string;
}

interface GetReportsResponse {
    reports: Report[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Helper function to convert image URI to base64
async function uriToBase64(uri: string): Promise<string> {
    try {
        // Use fetch to read the file
        const response = await fetch(uri);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result as string;
                // Remove the data URL prefix
                const base64 = base64data.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error converting to base64:", error);
        throw error;
    }
}

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_URL;
    }

    private async getHeaders(): Promise<Record<string, string>> {
        const token = await storage.getToken();
        const user = await storage.getUser();

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        if (user) {
            headers["X-User-Id"] = user.id;
            headers["X-User-Email"] = user.email;
        }

        return headers;
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Login error:", error);
            throw new Error("Gagal terhubung ke server");
        }
    }

    async register(
        name: string,
        email: string,
        password: string,
        phone?: string
    ): Promise<RegisterResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, phone }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Register error:", error);
            throw new Error("Gagal terhubung ke server");
        }
    }

    async uploadImage(imageUri: string): Promise<string> {
        try {
            // Convert image to base64 using fetch + FileReader
            const base64 = await uriToBase64(imageUri);

            // Get filename and type
            const filename = imageUri.split("/").pop() || "image.jpg";
            const match = /\.(\w+)$/.exec(filename);
            const extension = match ? match[1].toLowerCase() : "jpg";
            const type = `image/${extension === "jpg" ? "jpeg" : extension}`;

            // Send as JSON with base64
            const response = await fetch(`${this.baseUrl}/api/upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    base64: base64,
                    filename: filename,
                    type: type,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Gagal mengupload gambar");
            }

            return data.url;
        } catch (error) {
            console.error("Upload image error:", error);
            throw new Error(error instanceof Error ? error.message : "Gagal mengupload gambar");
        }
    }

    async createReport(reportData: {
        category: string;
        description: string;
        locationText: string;
        latitude: number;
        longitude: number;
        images?: string[];
    }): Promise<CreateReportResponse> {
        try {
            const headers = await this.getHeaders();
            const user = await storage.getUser();

            if (!user) {
                throw new Error("Anda harus login untuk membuat laporan");
            }

            const response = await fetch(`${this.baseUrl}/api/reports`, {
                method: "POST",
                headers,
                credentials: "include",
                body: JSON.stringify(reportData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Gagal membuat laporan");
            }

            return data;
        } catch (error) {
            console.error("Create report error:", error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Gagal terhubung ke server");
        }
    }

    async getMyReports(
        page: number = 1,
        status?: string
    ): Promise<GetReportsResponse> {
        try {
            const headers = await this.getHeaders();
            const user = await storage.getUser();

            if (!user) {
                throw new Error("Anda harus login untuk melihat laporan Anda");
            }

            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            });

            if (status) {
                params.append("status", status);
            }

            const response = await fetch(
                `${this.baseUrl}/api/reports/mine?${params.toString()}`,
                {
                    method: "GET",
                    headers,
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Gagal mengambil laporan");
            }

            return data;
        } catch (error) {
            console.error("Get my reports error:", error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Gagal terhubung ke server");
        }
    }

    async getReportDetail(id: string): Promise<ReportDetail> {
        try {
            const headers = await this.getHeaders();

            const response = await fetch(`${this.baseUrl}/api/reports/${id}`, {
                method: "GET",
                headers,
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Gagal mengambil detail laporan");
            }

            return data.report;
        } catch (error) {
            console.error("Get report detail error:", error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Gagal terhubung ke server");
        }
    }
}

export const api = new ApiService();
