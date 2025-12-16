"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Activity,
    Droplet,
    GraduationCap,
    Landmark,
    MapPin,
    Zap,
    Upload,
    X,
    Loader2,
    Image as ImageIcon,
    Search
} from "lucide-react";

// Dynamic import with ssr: false to prevent hydration mismatch with Leaflet
const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    ),
});

export default function LaporPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string>("Jalan");
    const [desc, setDesc] = useState("");

    // Location State
    const [location, setLocation] = useState("");
    const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // File Upload State
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = [
        { icon: MapPin, label: "Jalan" },
        { icon: Landmark, label: "Jembatan" },
        { icon: GraduationCap, label: "Sekolah" },
        { icon: Activity, label: "Kesehatan" },
        { icon: Droplet, label: "Air" },
        { icon: Zap, label: "Listrik" },
    ];

    // --- Handlers ---

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = (files: File[]) => {
        const newImages: File[] = [];
        const newPreviews: string[] = [];

        files.forEach(file => {
            if (file.type.startsWith("image/")) {
                newImages.push(file);
                newPreviews.push(URL.createObjectURL(file));
            }
        });

        setImages(prev => [...prev, ...newImages]);
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // --- Location Logic (Nominatim & OSM) ---

    const fetchAddress = async (lat: number, lng: number) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();
            if (data && data.display_name) {
                setLocation(data.display_name);
            } else {
                setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
            }
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
            setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setCoordinates({ lat: latitude, lng: longitude });
                await fetchAddress(latitude, longitude);
                setIsGettingLocation(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location");
                setIsGettingLocation(false);
            }
        );
    };

    const handleSearchLocation = async () => {
        if (!location) return;
        setIsSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`);
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
                setLocation(display_name);
            } else {
                alert("Lokasi tidak ditemukan");
            }
        } catch (error) {
            console.error("Search failed:", error);
            alert("Gagal mencari lokasi");
        }
        setIsSearching(false);
    };

    const handleLocationSelect = async (lat: number, lng: number) => {
        setCoordinates({ lat, lng });
        await fetchAddress(lat, lng);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchLocation();
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            <Header />

            <main className="container max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

                {/* Page Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-[#1e293b]">
                        Sampaikan Laporan Anda
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Bantu kami memperbaiki infrastruktur di daerah Anda. Isi formulir di bawah ini dengan detail.
                    </p>
                </div>

                <Card className="border shadow-sm bg-white">
                    <CardContent className="p-8 space-y-8">

                        {/* Jenis Masalah */}
                        <div className="space-y-4">
                            <Label className="text-base">Apa jenis masalahnya? <span className="text-red-500">*</span></Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {categories.map((item) => (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onClick={() => setSelectedCategory(item.label)}
                                        className={`
                      flex flex-col items-center justify-center gap-3 p-6 rounded-xl border transition-all duration-200
                      ${selectedCategory === item.label
                                                ? "border-blue-600 bg-blue-600 text-white shadow-md transform scale-[1.02]"
                                                : "border-gray-200 hover:border-blue-200 hover:bg-gray-50 text-gray-600 bg-white"
                                            }
                    `}
                                    >
                                        <item.icon className={`h-6 w-6 ${selectedCategory === item.label ? "text-white" : "text-gray-500"}`} />
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Detail Masalah */}
                            <div className="space-y-4">
                                <Label className="text-base">Ceritakan detail masalahnya <span className="text-red-500">*</span></Label>
                                <Textarea
                                    placeholder="Contoh: Jalan berlubang sedalam 20cm di depan pasar, membahayakan pengendara motor..."
                                    className="min-h-[200px] resize-none bg-gray-50/50 focus:bg-white transition-colors"
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                />
                                <div className="text-xs text-right text-gray-400">{desc.length}/500</div>
                            </div>

                            {/* Bukti Foto (Multi-Upload) */}
                            <div className="space-y-4">
                                <Label className="text-base">Bukti Foto <span className="text-red-500">*</span></Label>

                                {/* Upload Area */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`
                    relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200
                    ${isDragging
                                            ? "border-blue-500 bg-blue-50/50"
                                            : "border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 hover:border-blue-300"
                                        }
                    ${imagePreviews.length > 0 ? "h-32 mb-4" : "h-[200px]"}
                  `}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                    <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform duration-200">
                                        <Upload className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">
                                        Klik untuk upload <span className="text-gray-500 text-sm font-normal">atau drag & drop</span>
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        PNG, JPG up to 5MB (Bisa lebih dari satu)
                                    </p>
                                </div>

                                {/* Image Previews Grid */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4">
                                        {imagePreviews.map((src, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                                <img
                                                    src={src}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full"
                                                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lokasi */}
                        <div className="space-y-4">
                            <Label className="text-base">Dimana lokasi kejadian? <span className="text-red-500">*</span></Label>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="shrink-0 gap-2 h-11 bg-gray-50/50 dark:bg-gray-900/10 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                                    onClick={handleGetLocation}
                                    disabled={isGettingLocation}
                                >
                                    {isGettingLocation ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <MapPin className="h-4 w-4" />
                                    )}
                                    <span className="hidden sm:inline">Lokasi Saya</span>
                                </Button>
                                <div className="relative flex-1 flex gap-2">
                                    <div className="relative flex-1">
                                        <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Cari lokasi (Desa, Kecamatan, atau nama tempat)..."
                                            className="pl-9 h-11 bg-gray-50/50 focus:bg-white transition-colors"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                    <Button
                                        variant="secondary"
                                        className="h-11 px-4"
                                        onClick={handleSearchLocation}
                                        disabled={isSearching}
                                    >
                                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            {/* LIVE Map Selection */}
                            <div className="rounded-xl overflow-hidden border border-gray-200 h-80 bg-gray-50 relative z-0">
                                <LocationPicker
                                    center={coordinates}
                                    onLocationSelect={handleLocationSelect}
                                />

                                {!coordinates && (
                                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none z-10 w-full h-full">
                                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm text-sm text-gray-500">
                                            Klik peta untuk memilih lokasi
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex items-center justify-end gap-4">
                            <Button
                                variant="ghost"
                                className="text-gray-500 hover:text-gray-700 h-11 px-8"
                                onClick={() => router.push("/laporan-saya")}
                            >
                                Batal
                            </Button>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-8 shadow-sm shadow-blue-200 transition-all hover:shadow-blue-300 hover:-translate-y-0.5"
                                onClick={() => router.push("/laporan-saya")}
                            >
                                Kirim Laporan
                            </Button>
                        </div>

                    </CardContent>
                </Card>

                <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-gray-400" />
                    </span>
                    Data Anda aman dan akan diverifikasi oleh tim kami.
                </div>

            </main>
        </div>
    );
}
