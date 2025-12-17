"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SimpleAlertDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    onConfirm: () => void
    confirmText?: string
    cancelText?: string
    variant?: "default" | "destructive" | "success"
}

export function SimpleAlertDialog({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    confirmText = "Continue",
    cancelText = "Cancel",
    variant = "default",
}: SimpleAlertDialogProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0">
            <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full animate-in zoom-in-95 slide-in-from-right-1/2 slide-in-from-top-48">
                <div className="flex flex-col space-y-2 text-center sm:text-left">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === "success" ? "default" : variant === "destructive" ? "destructive" : "default"}
                        className={variant === "success" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                        onClick={() => {
                            onConfirm()
                            onOpenChange(false)
                        }}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    )
}
