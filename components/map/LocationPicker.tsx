"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
    center: { lat: number; lng: number } | null;
    onLocationSelect: (lat: number, lng: number) => void;
}

export default function LocationPicker({ center, onLocationSelect }: LocationPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markerInstance = useRef<L.Marker | null>(null);
    const defaultCenter = { lat: -6.1754, lng: 106.8272 }; // Jakarta default

    // Initialize Map
    useEffect(() => {
        if (!mapRef.current) return;

        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView(
                [defaultCenter.lat, defaultCenter.lng],
                13
            );

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapInstance.current);

            mapInstance.current.on("click", (e) => {
                const { lat, lng } = e.latlng;
                onLocationSelect(lat, lng);
            });
        }

        return () => {
            // Cleanup map on unmount if needed, though for single page apps 
            // sometimes it's better to keep it or carefully destroy.
            // mapInstance.current?.remove();
            // mapInstance.current = null;
        };
    }, []); // Run once on mount

    // Update View and Marker when center changes
    useEffect(() => {
        if (!mapInstance.current) return;

        const targetCenter = center || defaultCenter;

        // Move map if center is provided and valid
        // Only flyTo if the change is significant or it's the first set
        if (center) {
            mapInstance.current.setView([targetCenter.lat, targetCenter.lng], 16);
        }

        // Update Marker
        if (center) {
            if (markerInstance.current) {
                markerInstance.current.setLatLng([center.lat, center.lng]);
            } else {
                markerInstance.current = L.marker([center.lat, center.lng]).addTo(mapInstance.current);
            }
        } else {
            // If center is null (cleared), remove marker
            if (markerInstance.current) {
                markerInstance.current.remove();
                markerInstance.current = null;
            }
        }

    }, [center]);

    return <div ref={mapRef} className="w-full h-full z-0" />;
}
