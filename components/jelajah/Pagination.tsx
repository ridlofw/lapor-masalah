import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage?: number;
    onItemsPerPageChange?: (limit: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange
}: PaginationProps) {
    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const renderPageNumbers = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show 1
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            // Show window around current
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if at extremes
            if (currentPage <= 3) {
                end = 4;
            }
            if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            // Always show last
            pages.push(totalPages);
        }

        return pages.map((page, index) => {
            if (page === "...") {
                return <span key={`ellipsis-${index}`} className="text-gray-400 px-2">...</span>;
            }

            return (
                <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    className={`h-9 w-9 font-medium ${currentPage === page
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-white border-gray-200 hover:bg-gray-50 text-gray-600"
                        }`}
                    onClick={() => onPageChange(page as number)}
                >
                    {page}
                </Button>
            );
        });
    };

    return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 mb-8">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-white border-gray-200 hover:bg-gray-50 text-gray-400"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-2">
                    {renderPageNumbers()}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-white border-gray-200 hover:bg-gray-50 text-gray-600"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {itemsPerPage && onItemsPerPageChange && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Tampilkan:</span>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => onItemsPerPageChange(Number(value))}
                    >
                        <SelectTrigger className="h-9 w-[70px] bg-white">
                            <SelectValue placeholder={itemsPerPage.toString()} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                        </SelectContent>
                    </Select>
                    <span>per halaman</span>
                </div>
            )}
        </div>
    );
}
