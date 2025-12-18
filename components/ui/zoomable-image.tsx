"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";


interface ZoomableImageProps {
    src: string;
    alt: string;
    className?: string;
    imageClassName?: string;
    aspectRatio?: "video" | "square" | "portrait";
}

export function ZoomableImage({ src, alt, className, imageClassName, aspectRatio = "video" }: ZoomableImageProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={cn(
                    "relative overflow-hidden cursor-zoom-in",
                    aspectRatio === "video" && "aspect-video",
                    aspectRatio === "square" && "aspect-square",
                    className
                )}>
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className={cn("object-cover transition-transform hover:scale-105", imageClassName)}
                    />
                </div>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="max-w-[95vw] md:max-w-screen-lg p-0 overflow-hidden bg-transparent border-none shadow-none ring-0 outline-none">
                <VisuallyHidden.Root>
                    <DialogTitle>{alt}</DialogTitle>
                </VisuallyHidden.Root>

                <div className="relative w-full h-[85vh] flex flex-col items-center justify-center">
                    {/* Image */}
                    <div className="relative w-full h-full">
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Caption */}
                    {alt && (
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                                {alt}
                            </span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
