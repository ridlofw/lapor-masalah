
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon;
    statusIcon?: React.ReactNode;
    iconClassName?: string;
    valueClassName?: string;
}

export function StatsCard({ title, value, description, icon: Icon, statusIcon, iconClassName, valueClassName }: StatsCardProps) {
    return (
        <Card className="shadow-sm border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
                {Icon && <Icon className={`h-4 w-4 ${iconClassName || "text-gray-300"}`} />}
                {statusIcon}
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold tracking-tight ${valueClassName || "text-[#1e293b]"}`}>{value}</div>
                {description && (
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}
