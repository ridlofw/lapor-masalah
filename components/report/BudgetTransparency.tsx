import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Report } from "@/lib/data";

interface BudgetTransparencyProps {
    budget: Report["budget"];
}

export function BudgetTransparency({ budget }: BudgetTransparencyProps) {
    return (
        <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-[#1e293b]">
                    Transparansi Anggaran
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between mb-2">
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Terpakai</p>
                        <p className="text-lg font-bold text-blue-600">{budget.used}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Alokasi</p>
                        <p className="text-sm font-semibold text-gray-600">{budget.total}</p>
                    </div>
                </div>

                {/* Progress Bar Custom Implementation since we might not have the shadcn Progress component yet */}
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${budget.percentage}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
