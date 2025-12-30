"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ReportsChart() {
    const [range, setRange] = useState("monthly")
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true)
            try {
                const res = await fetch(`/api/admin/stats/chart?range=${range}`)
                if (res.ok) {
                    const json = await res.json()
                    setData(json.data)
                }
            } catch (error) {
                console.error("Failed to fetch chart data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [range])

    const getRangeLabel = () => {
        switch (range) {
            case "weekly": return "7 Hari Terakhir"
            case "monthly": return "30 Hari Terakhir"
            case "yearly": return "Tahun Ini"
            default: return "Bulan Ini"
        }
    }

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <div className="space-y-1">
                    <CardTitle>Statistik Laporan per Status</CardTitle>
                    <CardDescription>
                        Pantau jumlah laporan berdasarkan status ({getRangeLabel()}).
                    </CardDescription>
                </div>
                <Select value={range} onValueChange={setRange}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Pilih Periode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="weekly">Mingguan</SelectItem>
                        <SelectItem value="monthly">Bulanan</SelectItem>
                        <SelectItem value="yearly">Tahunan</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
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
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
