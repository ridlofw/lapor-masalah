"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Report } from "@/lib/types";
import { ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";
import { SimpleAlertDialog } from "@/components/ui/simple-alert-dialog";
import { useRouter } from "next/navigation";

interface ReportSupportProps {
    report: Report;
}

export function ReportSupport({ report }: ReportSupportProps) {
    const [isSupported, setIsSupported] = useState(false);
    const [count, setCount] = useState(report.supportCount);
    const [isLoading, setIsLoading] = useState(false);

    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const router = useRouter();

    // Fetch initial support status
    useEffect(() => {
        const checkSupport = async () => {
            try {
                const res = await fetch(`/api/reports/${report.id}/support`);
                if (res.ok) {
                    const data = await res.json();
                    setIsSupported(data.supported);
                    // Sync count from server
                    setCount(data.supportCount);
                }
            } catch (error) {
                console.error("Failed to fetch support status", error);
            }
        };
        checkSupport();
    }, [report.id]);

    const handleSupport = async () => {
        if (isLoading) return;
        setIsLoading(true);

        // Optimistic update
        const previousState = isSupported;
        const previousCount = count;

        const newSupportedState = !isSupported;
        setIsSupported(newSupportedState);
        setCount(prev => newSupportedState ? prev + 1 : prev - 1);

        try {
            const res = await fetch(`/api/reports/${report.id}/support`, {
                method: 'POST',
            });

            if (res.ok) {
                const data = await res.json();
                // Ensure state matches server response
                setIsSupported(data.supported);
                setCount(data.supportCount);
            } else {
                // Revert on error
                if (res.status === 401) {
                    setShowLoginAlert(true);
                }
                setIsSupported(previousState);
                setCount(previousCount);
            }
        } catch (error) {
            console.error("Support error", error);
            setIsSupported(previousState);
            setCount(previousCount);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-gray-100 bg-blue-50/50 mb-6">
            <SimpleAlertDialog
                open={showLoginAlert}
                onOpenChange={setShowLoginAlert}
                title="Login Diperlukan"
                description="Anda perlu login terlebih dahulu untuk memberikan dukungan pada laporan ini."
                confirmText="Login Sekarang"
                cancelText="Batal"
                onConfirm={() => router.push('/auth/login')}
            />
            <CardContent className="p-6">
                <h3 className="font-bold text-[#1e293b] mb-2">Dukung Laporan Ini</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Dukungan Anda membantu mempercepat prioritas perbaikan masalah ini.
                </p>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-blue-600">{count}</span>
                    <span className="text-sm text-gray-500 font-medium">Warga Mendukung</span>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={handleSupport}
                        disabled={isLoading}
                        className={`flex-1 shadow-lg transition-all ${isSupported
                            ? "bg-blue-800 hover:bg-blue-900 text-white shadow-blue-800/20"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                            }`}
                    >
                        <ThumbsUp className={`w-4 h-4 mr-2 ${isSupported ? "fill-current" : ""}`} />
                        {isSupported ? "Didukung" : "Beri Dukungan"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
