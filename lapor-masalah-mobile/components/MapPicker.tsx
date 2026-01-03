import React, { useState, useRef } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { COLORS } from "@/constants/config";

interface MapPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelectLocation: (lat: number, lng: number, address: string) => void;
    initialLatitude?: number;
    initialLongitude?: number;
}

export function MapPicker({
    visible,
    onClose,
    onSelectLocation,
    initialLatitude = -7.7956,
    initialLongitude = 110.3695,
}: MapPickerProps) {
    const [loading, setLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
        address: string;
    } | null>(null);
    const webViewRef = useRef<WebView>(null);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; width: 100%; }
        #map { height: 100%; width: 100%; }
        .info-box {
            position: absolute;
            bottom: 80px;
            left: 10px;
            right: 10px;
            background: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .info-box p {
            margin: 0;
            font-size: 14px;
            color: #374151;
        }
        .info-box .coords {
            font-size: 12px;
            color: #6B7280;
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <div class="info-box" id="info" style="display: none;">
        <p id="address">Tap peta untuk pilih lokasi</p>
        <p class="coords" id="coords"></p>
    </div>
    <script>
        var map = L.map('map').setView([${initialLatitude}, ${initialLongitude}], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
        
        var marker = null;
        var selectedData = null;
        
        map.on('click', function(e) {
            var lat = e.latlng.lat;
            var lng = e.latlng.lng;
            
            if (marker) {
                map.removeLayer(marker);
            }
            
            marker = L.marker([lat, lng]).addTo(map);
            
            // Show info box
            document.getElementById('info').style.display = 'block';
            document.getElementById('coords').textContent = 'Koordinat: ' + lat.toFixed(6) + ', ' + lng.toFixed(6);
            document.getElementById('address').textContent = 'Memuat alamat...';
            
            // Reverse geocode
            fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng)
                .then(response => response.json())
                .then(data => {
                    var address = data.display_name || 'Alamat tidak ditemukan';
                    document.getElementById('address').textContent = address;
                    selectedData = { lat: lat, lng: lng, address: address };
                    
                    // Send to React Native
                    window.ReactNativeWebView.postMessage(JSON.stringify(selectedData));
                })
                .catch(function() {
                    var address = 'Lat: ' + lat.toFixed(6) + ', Lng: ' + lng.toFixed(6);
                    document.getElementById('address').textContent = address;
                    selectedData = { lat: lat, lng: lng, address: address };
                    window.ReactNativeWebView.postMessage(JSON.stringify(selectedData));
                });
        });
    </script>
</body>
</html>
`;

    const handleMessage = (event: { nativeEvent: { data: string } }) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            setSelectedLocation(data);
        } catch (error) {
            console.error("Error parsing map message:", error);
        }
    };

    const handleConfirm = () => {
        if (selectedLocation) {
            onSelectLocation(
                selectedLocation.lat,
                selectedLocation.lng,
                selectedLocation.address
            );
        }
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                        <Text style={styles.cancelText}>Batal</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Pilih Lokasi</Text>
                    <TouchableOpacity
                        onPress={handleConfirm}
                        style={[styles.headerButton, !selectedLocation && styles.disabled]}
                        disabled={!selectedLocation}
                    >
                        <Text style={[styles.confirmText, !selectedLocation && styles.disabledText]}>
                            Pilih
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.mapContainer}>
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={styles.loadingText}>Memuat peta...</Text>
                        </View>
                    )}
                    <WebView
                        ref={webViewRef}
                        source={{ html: htmlContent }}
                        style={styles.webview}
                        onLoadEnd={() => setLoading(false)}
                        onMessage={handleMessage}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        geolocationEnabled={true}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Tap pada peta untuk memilih lokasi
                    </Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
        backgroundColor: COLORS.white,
    },
    headerButton: {
        paddingVertical: 8,
        paddingHorizontal: 4,
        minWidth: 60,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.gray[900],
    },
    cancelText: {
        fontSize: 16,
        color: COLORS.gray[500],
    },
    confirmText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.primary,
        textAlign: "right",
    },
    disabled: {
        opacity: 0.5,
    },
    disabledText: {
        color: COLORS.gray[400],
    },
    mapContainer: {
        flex: 1,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    loadingText: {
        marginTop: 8,
        color: COLORS.gray[500],
    },
    webview: {
        flex: 1,
    },
    footer: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: COLORS.gray[50],
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[200],
    },
    footerText: {
        textAlign: "center",
        color: COLORS.gray[500],
        fontSize: 14,
    },
});
