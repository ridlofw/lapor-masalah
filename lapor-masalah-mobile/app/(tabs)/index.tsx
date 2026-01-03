import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Button, Input, Card } from "@/components/ui";
import { CategoryPicker } from "@/components/CategoryPicker";
import { MapPicker } from "@/components/MapPicker";
import { ReportCategory, COLORS } from "@/constants/config";

export default function CreateReportScreen() {
    const { user, logout } = useAuth();
    const [category, setCategory] = useState<ReportCategory | null>(null);
    const [description, setDescription] = useState("");
    const [locationText, setLocationText] = useState("");
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [errors, setErrors] = useState<{
        category?: string;
        description?: string;
        location?: string;
    }>({});

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!category) {
            newErrors.category = "Pilih kategori laporan";
        }

        if (!description) {
            newErrors.description = "Deskripsi harus diisi";
        } else if (description.length < 20) {
            newErrors.description = "Deskripsi minimal 20 karakter";
        }

        if (!locationText) {
            newErrors.location = "Lokasi harus diisi";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getCurrentLocation = async () => {
        setGettingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Izin Ditolak", "Izin lokasi diperlukan untuk fitur ini");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);

            // Try to get address from coordinates
            const [address] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (address) {
                const addressText = [
                    address.street,
                    address.subregion,
                    address.city,
                    address.region,
                ]
                    .filter(Boolean)
                    .join(", ");
                setLocationText(addressText);
            }
        } catch (error) {
            Alert.alert("Error", "Gagal mendapatkan lokasi. Coba lagi.");
        } finally {
            setGettingLocation(false);
        }
    };

    const handleMapSelect = (lat: number, lng: number, address: string) => {
        setLatitude(lat);
        setLongitude(lng);
        setLocationText(address);
    };

    const pickImage = async () => {
        if (images.length >= 5) {
            Alert.alert("Batas Tercapai", "Maksimal 5 gambar per laporan");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const takePhoto = async () => {
        if (images.length >= 5) {
            Alert.alert("Batas Tercapai", "Maksimal 5 gambar per laporan");
            return;
        }

        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Izin Ditolak", "Izin kamera diperlukan untuk fitur ini");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            // Upload images first
            const uploadedUrls: string[] = [];
            for (const imageUri of images) {
                try {
                    const url = await api.uploadImage(imageUri);
                    uploadedUrls.push(url);
                } catch (error) {
                    console.error("Failed to upload image:", error);
                    // Continue even if one image fails
                }
            }

            // Create report
            await api.createReport({
                category: category!,
                description,
                locationText,
                latitude: latitude || -7.7956,
                longitude: longitude || 110.3695,
                images: uploadedUrls,
            });

            Alert.alert("Berhasil! 🎉", "Laporan Anda berhasil dikirim.", [
                {
                    text: "OK",
                    onPress: () => {
                        // Reset form
                        setCategory(null);
                        setDescription("");
                        setLocationText("");
                        setLatitude(null);
                        setLongitude(null);
                        setImages([]);
                    },
                },
            ]);
        } catch (error) {
            Alert.alert(
                "Gagal",
                error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim laporan"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert("Logout", "Apakah Anda yakin ingin keluar?", [
            { text: "Batal", style: "cancel" },
            { text: "Keluar", onPress: logout, style: "destructive" },
        ]);
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.flex}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Buat Laporan</Text>
                        <Text style={styles.headerSubtitle}>Halo, {user?.name}!</Text>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.logoutText}>Keluar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <Card variant="elevated">
                        {/* Category */}
                        <CategoryPicker
                            value={category}
                            onChange={setCategory}
                            error={errors.category}
                        />

                        {/* Description */}
                        <Input
                            label="Deskripsi Masalah"
                            placeholder="Jelaskan masalah yang Anda temukan secara detail..."
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
                            numberOfLines={4}
                            error={errors.description}
                        />

                        {/* Location */}
                        <Input
                            label="Lokasi"
                            placeholder="Alamat atau lokasi kejadian"
                            value={locationText}
                            onChangeText={setLocationText}
                            error={errors.location}
                        />

                        <View style={styles.locationButtons}>
                            <Button
                                title={gettingLocation ? "Mendapatkan..." : "📍 GPS"}
                                variant="outline"
                                size="sm"
                                onPress={getCurrentLocation}
                                loading={gettingLocation}
                                style={styles.locationButton}
                            />
                            <Button
                                title="🗺️ Pilih di Peta"
                                variant="outline"
                                size="sm"
                                onPress={() => setShowMapPicker(true)}
                                style={styles.locationButton}
                            />
                        </View>

                        {latitude && longitude && (
                            <Text style={styles.coordsText}>
                                Koordinat: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                            </Text>
                        )}

                        {/* Images */}
                        <View style={styles.imagesSection}>
                            <Text style={styles.imagesLabel}>Bukti Foto</Text>

                            <View style={styles.imagesContainer}>
                                {images.map((uri, index) => (
                                    <View key={index} style={styles.imageWrapper}>
                                        <Image source={{ uri }} style={styles.previewImage} />
                                        <TouchableOpacity
                                            onPress={() => removeImage(index)}
                                            style={styles.removeImageButton}
                                        >
                                            <Text style={styles.removeImageText}>×</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                {images.length < 5 && (
                                    <>
                                        <TouchableOpacity onPress={pickImage} style={styles.addImageButton}>
                                            <Text style={styles.addImageIcon}>🖼️</Text>
                                            <Text style={styles.addImageText}>Galeri</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={takePhoto} style={styles.addImageButton}>
                                            <Text style={styles.addImageIcon}>📷</Text>
                                            <Text style={styles.addImageText}>Kamera</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>

                        <Button
                            title="Kirim Laporan"
                            onPress={handleSubmit}
                            loading={loading}
                        />
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Map Picker Modal */}
            <MapPicker
                visible={showMapPicker}
                onClose={() => setShowMapPicker(false)}
                onSelectLocation={handleMapSelect}
                initialLatitude={latitude || undefined}
                initialLongitude={longitude || undefined}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    flex: {
        flex: 1,
    },
    header: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[100],
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.gray[900],
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.gray[500],
    },
    logoutButton: {
        backgroundColor: COLORS.gray[100],
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    logoutText: {
        color: COLORS.gray[600],
        fontSize: 14,
        fontWeight: "500",
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    locationButtons: {
        flexDirection: "row",
        marginBottom: 16,
    },
    locationButton: {
        flex: 1,
        marginRight: 8,
    },
    coordsText: {
        fontSize: 12,
        color: COLORS.gray[400],
        marginBottom: 16,
    },
    imagesSection: {
        marginBottom: 16,
    },
    imagesLabel: {
        color: COLORS.gray[700],
        fontWeight: "500",
        marginBottom: 8,
        fontSize: 14,
    },
    imagesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    imageWrapper: {
        marginRight: 8,
        marginBottom: 8,
        position: "relative",
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    removeImageButton: {
        position: "absolute",
        top: -8,
        right: -8,
        backgroundColor: COLORS.error,
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    removeImageText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: "bold",
    },
    addImageButton: {
        width: 80,
        height: 80,
        backgroundColor: COLORS.gray[100],
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
        marginBottom: 8,
    },
    addImageIcon: {
        fontSize: 24,
    },
    addImageText: {
        fontSize: 12,
        color: COLORS.gray[500],
        marginTop: 4,
    },
});
