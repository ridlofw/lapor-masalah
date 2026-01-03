import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    ActivityIndicator,
    StyleSheet,
    Linking,
    TouchableOpacity,
    Dimensions,
    FlatList,
    RefreshControl,
    BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { api, ReportDetail, TimelineEvent, ProgressUpdate } from "@/services/api";
import { StatusBadge } from "@/components/ui";
import { ImageViewer } from "@/components/ImageViewer";
import { REPORT_CATEGORIES, COLORS } from "@/constants/config";

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = 250;

export default function ReportDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                router.navigate("/(tabs)/laporan-saya");
                return true; // prevent default behavior
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [])
    );
    const [report, setReport] = useState<ReportDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [viewerImages, setViewerImages] = useState<string[]>([]);
    const [viewerInitialIndex, setViewerInitialIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const fetchReportDetail = useCallback(async () => {
        try {
            setError(null);
            const data = await api.getReportDetail(id!);
            setReport(data);
        } catch (err) {
            console.error("Error fetching report:", err);
            setError(err instanceof Error ? err.message : "Gagal memuat detail laporan");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetchReportDetail();
        }
    }, [id, fetchReportDetail]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchReportDetail();
    }, [fetchReportDetail]);

    const openImageViewer = (images: string[], index: number = 0) => {
        setViewerImages(images);
        setViewerInitialIndex(index);
        setImageViewerVisible(true);
    };

    const getCategoryInfo = (category: string) => {
        return REPORT_CATEGORIES.find((c) => c.value === category) || {
            icon: "📋",
            label: category,
        };
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatShortDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const openInMaps = () => {
        if (report?.latitude && report?.longitude) {
            const url = `https://www.google.com/maps?q=${report.latitude},${report.longitude}`;
            Linking.openURL(url);
        }
    };

    const getActorLabel = (actor: any) => {
        if (!actor) return 'Sistem';
        if (actor.role === 'ADMIN') return 'Admin Pemerintahan';
        if (actor.role === 'USER') return ''; // Don't show user name in timeline title if we want to hide it, or keep it generic
        if (actor.role === 'DINAS') {
            const name = actor.name.toLowerCase();
            if (name.includes('pekerjaan umum') || name.includes('pupr')) return 'Dinas PUPR';
            if (name.includes('energi') || name.includes('esdm')) return 'Dinas ESDM';
            if (name.includes('pendidikan')) return 'Dinas Pendidikan';
            if (name.includes('kesehatan')) return 'Dinas Kesehatan';

            // Remove "Petugas " prefix if exists
            return actor.name.replace(/^petugas\s+/i, '');
        }
        return actor.name;
    };

    const getDinasName = (originalName: string) => {
        const name = originalName.toLowerCase();
        if (name.includes('pekerjaan umum') || name.includes('pupr')) return 'Dinas PUPR';
        if (name.includes('energi') || name.includes('esdm')) return 'Dinas ESDM';
        if (name.includes('pendidikan')) return 'Dinas Pendidikan';
        if (name.includes('kesehatan')) return 'Dinas Kesehatan';
        return originalName;
    };

    const getTimelineIcon = (eventType: string) => {
        const icons: Record<string, string> = {
            LAPORAN_DIBUAT: "📝",
            CREATED: "📝",
            DIVERIFIKASI_ADMIN: "✅",
            DIDISPOSISIKAN: "📤",
            DIVERIFIKASI_DINAS: "🏛️",
            PROGRESS_UPDATE: "🔄",
            SELESAI: "🎉",
            COMPLETED: "🎉",
            DITOLAK: "❌",
            DITOLAK_DINAS: "❌",
        };
        return icons[eventType] || "📌";
    };

    const getTimelineColor = (eventType: string) => {
        const colors: Record<string, string> = {
            LAPORAN_DIBUAT: COLORS.gray[400],
            CREATED: COLORS.gray[400],
            DIVERIFIKASI_ADMIN: COLORS.success,
            DIDISPOSISIKAN: COLORS.primary,
            DIVERIFIKASI_DINAS: "#8B5CF6",
            PROGRESS_UPDATE: "#F59E0B",
            SELESAI: COLORS.success,
            COMPLETED: COLORS.success,
            DITOLAK: COLORS.error,
            DITOLAK_DINAS: COLORS.error,
        };
        return colors[eventType] || COLORS.gray[400];
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentImageIndex(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Memuat detail laporan...</Text>
            </SafeAreaView>
        );
    }

    if (error || !report) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Text style={styles.errorIcon}>❌</Text>
                <Text style={styles.errorText}>{error || "Laporan tidak ditemukan"}</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Kembali</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const categoryInfo = getCategoryInfo(report.category);
    // Filter completion images out of the main gallery if needed, but usually main gallery shows initial report images
    // Assuming report.images contains only initial report images or we filter by type if API returns all
    const reportImages = report.images?.filter((img: any) => img.type !== 'PENYELESAIAN').map((img) => img.url) || [];

    // Process Timeline
    // 1. Filter out redundant PROGRESS_UPDATE from main timeline array if they are duplicate
    // 2. Map Progress Updates from separate array into the timeline
    // 3. Handle Completion images

    // Get all progress updates to check for duplication
    const progressIds = report.progress.map(p => p.id);

    const timelineEvents = [
        ...report.timeline
            // Filter out PROGRESS_UPDATE if they are already in the progress array (check by ID if possible, or just exclude all timeline progress events and use the progress array)
            // The issue is duplication. Let's exclude "PROGRESS_UPDATE" from report.timeline and only use report.progress
            .filter((t: any) => t.eventType !== "PROGRESS_UPDATE")
            .map((t: any) => {
                const actorLabel = getActorLabel(t.actor);

                // Get completion images if this is a completion event
                let eventImages: string[] = [];
                if (t.eventType === 'SELESAI' || t.eventType === 'COMPLETED') {
                    // Look for completion images in report.images with type 'PENYELESAIAN'
                    eventImages = report.images?.filter(img => img.type === 'PENYELESAIAN').map(img => img.url) || [];
                }

                return {
                    id: t.id,
                    eventType: t.eventType,
                    title: actorLabel && actorLabel !== 'Sistem' ? `${actorLabel}: ${t.title}` : t.title,
                    description: t.description,
                    createdAt: t.createdAt,
                    budgetUsed: t.budgetUsed,
                    images: eventImages,
                    actor: t.actor
                };
            }),
        ...report.progress.map((p) => ({
            id: p.id,
            eventType: "PROGRESS_UPDATE",
            title: `${getDinasName(report.dinas?.name || 'Dinas')}: Update Progress`,
            description: p.description,
            budgetUsed: p.budgetUsed,
            actor: p.createdBy ? { id: p.createdBy.id, name: p.createdBy.name, role: "DINAS" } : undefined,
            createdAt: p.createdAt,
            images: p.images, // Progress images directly from progress object
        })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


    const renderImageItem = ({ item, index }: { item: string; index: number }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => openImageViewer(reportImages, index)}
        >
            <Image
                source={{ uri: item }}
                style={styles.galleryImage}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );

    const handleBack = () => {
        // Navigate explicitly to My Reports tab list
        router.navigate("/(tabs)/laporan-saya");
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.headerBack}>
                    <Text style={styles.headerBackText}>← Kembali</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Laporan</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
            >
                {/* Swipeable Image Gallery */}
                {reportImages.length > 0 ? (
                    <View style={styles.imageGalleryContainer}>
                        <FlatList
                            ref={flatListRef}
                            data={reportImages}
                            renderItem={renderImageItem}
                            keyExtractor={(_, index) => index.toString()}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onViewableItemsChanged={onViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                        />

                        {/* Image Counter Badge */}
                        <View style={styles.imageCounterBadge}>
                            <Text style={styles.imageCounterText}>
                                {currentImageIndex + 1} / {reportImages.length}
                            </Text>
                        </View>

                        {/* Dots indicator */}
                        {reportImages.length > 1 && (
                            <View style={styles.dotsContainer}>
                                {reportImages.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.dot,
                                            currentImageIndex === index && styles.dotActive,
                                        ]}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.noImageContainer}>
                        <Text style={styles.noImageText}>Tidak ada foto lampiran</Text>
                    </View>
                )}

                {/* Report Info Card */}
                <View style={styles.infoCard}>
                    {/* Status & Category */}
                    <View style={styles.statusRow}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryIcon}>{categoryInfo.icon}</Text>
                            <Text style={styles.categoryText}>{categoryInfo.label}</Text>
                        </View>
                        <StatusBadge status={report.status} />
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>{report.description}</Text>

                    {/* Date */}
                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>📅</Text>
                        <Text style={styles.infoText}>{formatDate(report.createdAt)}</Text>
                    </View>

                    {/* REMOVED USER INFO AS REQUESTED */}

                    {/* Support */}
                    {report.supportCount > 0 && (
                        <View style={styles.supportBadge}>
                            <Text style={styles.supportText}>
                                👍 {report.supportCount} orang mendukung
                            </Text>
                        </View>
                    )}
                </View>

                {/* Location Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📍 Lokasi</Text>
                    <Text style={styles.locationText}>{report.locationText}</Text>
                    <TouchableOpacity onPress={openInMaps} style={styles.mapButton}>
                        <Text style={styles.mapButtonText}>Buka di Google Maps</Text>
                    </TouchableOpacity>
                </View>

                {/* Dinas Info */}
                {report.dinas && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>🏛️ Ditangani Oleh</Text>
                        <Text style={styles.dinasName}>{getDinasName(report.dinas.name)}</Text>
                    </View>
                )}

                {/* Budget Card */}
                {report.budget && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>💰 Transparansi Anggaran</Text>
                        <View style={styles.budgetGrid}>
                            <View style={styles.budgetItem}>
                                <Text style={styles.budgetLabel}>Total Anggaran</Text>
                                <Text style={styles.budgetValue}>
                                    Rp {parseInt(report.budget.total).toLocaleString("id-ID")}
                                </Text>
                            </View>
                            <View style={styles.budgetItem}>
                                <Text style={styles.budgetLabel}>Terpakai</Text>
                                <Text style={styles.budgetValueUsed}>
                                    Rp {parseInt(report.budget.used).toLocaleString("id-ID")}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View
                                style={[
                                    styles.progressBar,
                                    { width: `${report.budget.percentage}%` },
                                ]}
                            />
                        </View>
                        <Text style={styles.budgetPercentage}>
                            {report.budget.percentage}% dari anggaran terpakai
                        </Text>
                    </View>
                )}

                {/* Timeline Card */}
                {timelineEvents.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>📋 Riwayat Penanganan</Text>

                        <View style={styles.timeline}>
                            {timelineEvents.map((event, index) => {
                                const isLast = index === timelineEvents.length - 1;
                                const color = getTimelineColor(event.eventType);

                                return (
                                    <View key={event.id} style={styles.timelineItem}>
                                        {/* Left: Icon and Line */}
                                        <View style={styles.timelineLeft}>
                                            <View style={[styles.timelineDot, { backgroundColor: color }]}>
                                                <Text style={styles.timelineDotIcon}>
                                                    {getTimelineIcon(event.eventType)}
                                                </Text>
                                            </View>
                                            {!isLast && (
                                                <View style={[styles.timelineLine, { backgroundColor: COLORS.gray[200] }]} />
                                            )}
                                        </View>

                                        {/* Right: Content */}
                                        <View style={styles.timelineContent}>
                                            <Text style={styles.timelineTitle}>
                                                {event.title}
                                            </Text>

                                            {event.description && (
                                                <Text style={styles.timelineDescription}>
                                                    {event.description}
                                                </Text>
                                            )}

                                            {event.budgetUsed && parseInt(event.budgetUsed) > 0 && (
                                                <View style={styles.timelineBudgetBadge}>
                                                    <Text style={styles.timelineBudgetText}>
                                                        💵 Rp {parseInt(event.budgetUsed).toLocaleString("id-ID")}
                                                    </Text>
                                                </View>
                                            )}

                                            {/* Event Images (Progress or Completion) */}
                                            {event.images && event.images.length > 0 && (
                                                <ScrollView
                                                    horizontal
                                                    showsHorizontalScrollIndicator={false}
                                                    style={styles.timelineImages}
                                                >
                                                    {event.images.map((img: string, imgIndex: number) => (
                                                        <TouchableOpacity
                                                            key={imgIndex}
                                                            onPress={() => openImageViewer(event.images as string[], imgIndex)}
                                                        >
                                                            <Image
                                                                source={{ uri: img }}
                                                                style={styles.timelineImage}
                                                            />
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            )}

                                            <Text style={styles.timelineDate}>
                                                {formatShortDate(event.createdAt)}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Notes */}
                {(report.rejectionReason || report.completionNote) && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>📝 Catatan</Text>
                        {report.rejectionReason && (
                            <View style={styles.noteBox}>
                                <Text style={styles.noteLabel}>Alasan Penolakan:</Text>
                                <Text style={styles.noteText}>{report.rejectionReason}</Text>
                            </View>
                        )}
                        {report.completionNote && (
                            <View style={styles.noteBoxSuccess}>
                                <Text style={styles.noteLabelSuccess}>Catatan Penyelesaian:</Text>
                                <Text style={styles.noteTextSuccess}>{report.completionNote}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Bottom padding */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Image Viewer Modal */}
            <ImageViewer
                images={viewerImages}
                visible={imageViewerVisible}
                initialIndex={viewerInitialIndex}
                onClose={() => setImageViewerVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.gray[50],
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: COLORS.gray[50],
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        color: COLORS.gray[500],
        marginTop: 8,
    },
    errorContainer: {
        flex: 1,
        backgroundColor: COLORS.gray[50],
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorText: {
        color: COLORS.gray[600],
        fontSize: 16,
        textAlign: "center",
        marginBottom: 24,
    },
    backButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: COLORS.white,
        fontWeight: "600",
    },
    header: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerBack: {
        padding: 4,
    },
    headerBackText: {
        color: COLORS.primary,
        fontSize: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.gray[900],
    },
    headerPlaceholder: {
        width: 70,
    },
    content: {
        flex: 1,
    },
    // Image Gallery Styles
    imageGalleryContainer: {
        position: "relative",
    },
    noImageContainer: {
        width: width,
        height: 150,
        backgroundColor: COLORS.gray[200],
        alignItems: "center",
        justifyContent: "center",
    },
    noImageText: {
        color: COLORS.gray[500],
    },
    galleryImage: {
        width: width,
        height: IMAGE_HEIGHT,
    },
    imageCounterBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "rgba(0,0,0,0.7)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    imageCounterText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "600",
    },
    // REMOVED zoomHintBadge
    dotsContainer: {
        position: "absolute",
        bottom: 12,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(255,255,255,0.5)",
        marginHorizontal: 4,
    },
    dotActive: {
        backgroundColor: COLORS.white,
    },
    // Info Card
    infoCard: {
        backgroundColor: COLORS.white,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statusRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    categoryBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EFF6FF",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    categoryIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    categoryText: {
        color: COLORS.primaryDark,
        fontSize: 13,
        fontWeight: "600",
    },
    description: {
        fontSize: 16,
        color: COLORS.gray[800],
        lineHeight: 24,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    infoIcon: {
        fontSize: 14,
        marginRight: 8,
    },
    infoText: {
        color: COLORS.gray[600],
        fontSize: 14,
    },
    supportBadge: {
        backgroundColor: "#FEF3C7",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 12,
        alignSelf: "flex-start",
    },
    supportText: {
        color: "#92400E",
        fontSize: 13,
        fontWeight: "500",
    },
    card: {
        backgroundColor: COLORS.white,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.gray[900],
        marginBottom: 12,
    },
    locationText: {
        color: COLORS.gray[600],
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
    },
    mapButton: {
        backgroundColor: "#EFF6FF",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    mapButtonText: {
        color: COLORS.primary,
        fontWeight: "600",
        fontSize: 14,
    },
    dinasName: {
        color: COLORS.gray[700],
        fontSize: 15,
        fontWeight: "500",
    },
    budgetGrid: {
        flexDirection: "row",
        marginBottom: 12,
    },
    budgetItem: {
        flex: 1,
    },
    budgetLabel: {
        color: COLORS.gray[500],
        fontSize: 12,
        marginBottom: 4,
    },
    budgetValue: {
        color: COLORS.gray[800],
        fontSize: 16,
        fontWeight: "700",
    },
    budgetValueUsed: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: "700",
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: COLORS.gray[200],
        borderRadius: 4,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        backgroundColor: COLORS.primary,
        borderRadius: 4,
    },
    budgetPercentage: {
        color: COLORS.gray[500],
        fontSize: 12,
        textAlign: "center",
        marginTop: 8,
    },
    timeline: {
        marginTop: 4,
    },
    timelineItem: {
        flexDirection: "row",
    },
    timelineLeft: {
        alignItems: "center",
        width: 50,
    },
    timelineDot: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    timelineDotIcon: {
        fontSize: 16,
    },
    timelineLine: {
        flex: 1,
        width: 2,
        minHeight: 40,
        marginTop: 4,
        marginBottom: 4,
    },
    timelineContent: {
        flex: 1,
        paddingBottom: 20,
        paddingLeft: 8,
    },
    timelineTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.gray[800],
        marginBottom: 4,
    },
    timelineDescription: {
        fontSize: 13,
        color: COLORS.gray[600],
        lineHeight: 18,
        marginBottom: 6,
    },
    timelineBudgetBadge: {
        backgroundColor: "#D1FAE5",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: "flex-start",
        marginBottom: 6,
    },
    timelineBudgetText: {
        color: "#065F46",
        fontSize: 12,
        fontWeight: "500",
    },
    timelineImages: {
        marginTop: 8,
        marginBottom: 8,
    },
    timelineImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 8,
    },
    timelineDate: {
        fontSize: 12,
        color: COLORS.gray[400],
    },
    noteBox: {
        backgroundColor: "#FEF2F2",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    noteLabel: {
        color: "#991B1B",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 4,
    },
    noteText: {
        color: "#7F1D1D",
        fontSize: 14,
    },
    noteBoxSuccess: {
        backgroundColor: "#ECFDF5",
        padding: 12,
        borderRadius: 8,
    },
    noteLabelSuccess: {
        color: "#065F46",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 4,
    },
    noteTextSuccess: {
        color: "#064E3B",
        fontSize: 14,
    },
});
