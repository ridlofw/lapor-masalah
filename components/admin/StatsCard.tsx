import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string
    icon: LucideIcon
    trend?: string
    trendUp?: boolean
    description?: string
    iconColor?: string
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    description,
    iconColor
}: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className={cn("h-4 w-4", iconColor)} />
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{value}</div>
                    {trend && (
                        <span className={cn("text-xs font-medium", trendUp ? "text-emerald-500" : "text-rose-500")}>
                            {trend}
                        </span>
                    )}
                </div>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </CardContent>
        </Card>
    )
}
