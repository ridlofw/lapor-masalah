"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const data = [
    { name: "Jan", selesai: 20, dalam_proses: 10, belum_terjawab: 2 },
    { name: "Feb", selesai: 25, dalam_proses: 12, belum_terjawab: 3 },
    { name: "Mar", selesai: 22, dalam_proses: 15, belum_terjawab: 1 },
    { name: "Apr", selesai: 28, dalam_proses: 13, belum_terjawab: 4 },
    { name: "Mei", selesai: 30, dalam_proses: 11, belum_terjawab: 2 },
    { name: "Jun", selesai: 35, dalam_proses: 14, belum_terjawab: 2 },
    { name: "Jul", selesai: 32, dalam_proses: 16, belum_terjawab: 4 },
    { name: "Agu", selesai: 28, dalam_proses: 18, belum_terjawab: 0 },
    { name: "Sep", selesai: 30, dalam_proses: 15, belum_terjawab: 5 },
    { name: "Okt", selesai: 25, dalam_proses: 12, belum_terjawab: 6 },
    { name: "Nov", selesai: 29, dalam_proses: 10, belum_terjawab: 4 },
    { name: "Des", selesai: 25, dalam_proses: 10, belum_terjawab: 3 },
]

export function DinasReportsChart() {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Statistik Laporan per Status</CardTitle>
                <CardDescription>
                    Pantau statistik dan laporan terbaru yang ditugaskan untuk Anda.
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
                        <Bar dataKey="dalam_proses" name="Dalam Proses" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                        <Bar dataKey="belum_terjawab" name="Belum Terjawab" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
