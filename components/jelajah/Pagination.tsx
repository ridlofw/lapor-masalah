"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination() {
    return (
        <div className="flex justify-center items-center gap-2 mt-12 mb-8">
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-white border-gray-200 hover:bg-gray-50 text-gray-400"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
                className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
                1
            </Button>

            <Button
                variant="outline"
                className="h-9 w-9 bg-white border-gray-200 hover:bg-gray-50 text-gray-600 font-medium"
            >
                2
            </Button>

            <Button
                variant="outline"
                className="h-9 w-9 bg-white border-gray-200 hover:bg-gray-50 text-gray-600 font-medium"
            >
                3
            </Button>

            <span className="text-gray-400 px-2">...</span>

            <Button
                variant="outline"
                className="h-9 w-9 bg-white border-gray-200 hover:bg-gray-50 text-gray-600 font-medium"
            >
                8
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-white border-gray-200 hover:bg-gray-50 text-gray-600"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
