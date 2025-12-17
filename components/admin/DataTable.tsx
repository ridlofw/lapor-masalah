"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChevronDown, ChevronUp, ChevronsUpDown, MoreHorizontal, Search } from "lucide-react"

export type ColumnDef<T> = {
    key: keyof T
    header: string
    sortable?: boolean
    cell?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
    data: T[]
    columns: ColumnDef<T>[]
    searchKeys: (keyof T)[]
    initialPageSize?: number
    renderRowActions?: (item: T) => React.ReactNode
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    searchKeys,
    initialPageSize = 10,
    renderRowActions,
}: DataTableProps<T>) {
    // ... (state logic remains same)
    const [searchQuery, setSearchQuery] = useState("")
    const [pageSize, setPageSize] = useState(initialPageSize)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(
        null
    )

    // Filter
    const filteredData = data.filter((item) =>
        searchKeys.some((key) => {
            const value = item[key]
            return String(value).toLowerCase().includes(searchQuery.toLowerCase())
        })
    )

    // Sort
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig) return 0
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
    })

    // Paginate
    const totalPages = Math.ceil(sortedData.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedData = sortedData.slice(startIndex, startIndex + pageSize)

    // Handlers
    const handleSort = (key: keyof T) => {
        setSortConfig((current) => {
            if (current?.key === key && current.direction === "asc") {
                return { key, direction: "desc" }
            }
            return { key, direction: "asc" }
        })
    }

    // ... (render logic)

    return (
        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
            {/* Controls ... */}
            <div className="flex items-center justify-between p-4 flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show</span>
                    <Select
                        value={String(pageSize)}
                        onValueChange={(val) => {
                            setPageSize(Number(val))
                            setCurrentPage(1)
                        }}
                    >
                        <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="relative w-full overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead
                                    key={String(col.key)}
                                    className={col.sortable ? "cursor-pointer select-none" : ""}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.header}
                                        {col.sortable && (
                                            <span className="ml-1">
                                                {sortConfig?.key === col.key ? (
                                                    sortConfig.direction === "asc" ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )
                                                ) : (
                                                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => (
                                <TableRow key={item.id}>
                                    {columns.map((col) => (
                                        <TableCell key={`${item.id}-${String(col.key)}`}>
                                            {col.cell ? col.cell(item) : (item[col.key] as React.ReactNode)}
                                        </TableCell>
                                    ))}
                                    <TableCell className="text-right">
                                        {renderRowActions ? renderRowActions(item) : (
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Menu</span>
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 1}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between border-t p-4">
                <div className="text-sm text-muted-foreground">
                    Menampilkan {paginatedData.length > 0 ? startIndex + 1 : 0}-
                    {Math.min(startIndex + pageSize, sortedData.length)} dari {sortedData.length} laporan
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
