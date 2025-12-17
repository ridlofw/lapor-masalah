"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const data = [
    { name: "Jan", selesai: 40, progress: 24, unverified: 24 },
    { name: "Feb", selesai: 30, progress: 13, unverified: 22 },
    { name: "Mar", selesai: 20, progress: 58, unverified: 22 },
    { name: "Apr", selesai: 27, progress: 39, unverified: 20 },
    { name: "Mei", selesai: 18, progress: 48, unverified: 21 },
    { name: "Jun", selesai: 23, progress: 38, unverified: 25 },
    { name: "Jul", selesai: 34, progress: 43, unverified: 21 },
    { name: "Agu", selesai: 40, progress: 24, unverified: 24 },
    { name: "Sep", selesai: 30, progress: 13, unverified: 22 },
    { name: "Okt", selesai: 20, progress: 58, unverified: 22 },
    { name: "Nov", selesai: 27, progress: 39, unverified: 20 },
    { name: "Des", selesai: 18, progress: 48, unverified: 21 },
]

export function ReportsChart() {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Statistik Laporan per Status</CardTitle>
                <CardDescription>
                    Pantau jumlah laporan berdasarkan status setiap bulan.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: "transparent" }}
                            contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                        />
                        <Legend iconType="circle" />
                        <Bar dataKey="selesai" name="Selesai" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                        <Bar dataKey="progress" name="Dalam Progress" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                        <Bar dataKey="unverified" name="Belum Diverifikasi" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
