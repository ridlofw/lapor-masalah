import React, { useState, useCallback, useMemo } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    TouchableOpacity,
    ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, router } from "expo-router";
import { api, Report } from "@/services/api";
import { ReportCard } from "@/components/ReportCard";
import { COLORS, REPORT_STATUSES } from "@/constants/config";

// Extract Header Component to prevent re-renders causing keyboard dismiss
const FilterHeader = ({
    searchQuery,
    onSearchChange,
    selectedStatus,
    onStatusSelect
}: {
    searchQuery: string,
    onSearchChange: (text: string) => void,
    selectedStatus: string | null,
    onStatusSelect: (status: string | null) => void
}) => {
    return (
        <View style={styles.headerContainer}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari laporan..."
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    placeholderTextColor={COLORS.gray[400]}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => onSearchChange("")}>
                        <Text style={styles.clearIcon}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Filter Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
                contentContainerStyle={styles.filterContent}
            >
                <TouchableOpacity
                    style={[
                        styles.filterChip,
                        selectedStatus === null && styles.filterChipActive
                    ]}
                    onPress={() => onStatusSelect(null)}
                >
                    <Text style={[
                        styles.filterChipText,
                        selectedStatus === null && styles.filterChipTextActive
                    ]}>Semua</Text>
                </TouchableOpacity>

                {REPORT_STATUSES.map((status) => (
                    <TouchableOpacity
                        key={status.value}
                        style={[
                            styles.filterChip,
                            selectedStatus === status.value && styles.filterChipActive
                        ]}
                        onPress={() => onStatusSelect(status.value)}
                    >
                        <Text style={[
                            styles.filterChipText,
                            selectedStatus === status.value && styles.filterChipTextActive
                        ]}>{status.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default function MyReportsScreen() {
    const [reports, setReports] = useState<Report[]>([]);
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    const filterReports = useCallback((data: Report[], search: string, status: string | null) => {
        let result = data;

        // Filter by Status
        if (status) {
            result = result.filter(r => r.status === status);
        }

        // Filter by Search (Title/Description or Location)
        if (search) {
            const query = search.toLowerCase();
            result = result.filter(
                r =>
                    r.description.toLowerCase().includes(query) ||
                    r.locationText.toLowerCase().includes(query) ||
                    r.category.toLowerCase().includes(query)
            );
        }

        setFilteredReports(result);
    }, []);

    const fetchMyReports = async () => {
        try {
            setError(null);
            const data = await api.getMyReports();
            // API returns { reports: [], pagination: ... }
            const reportsData = data.reports || [];
            setReports(reportsData);
            // Apply current filters to new data
            filterReports(reportsData, searchQuery, selectedStatus);
        } catch (err) {
            console.error("Error fetching my reports:", err);
            setError("Gagal memuat laporan saya");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchMyReports();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchMyReports();
    }, []);

    // Handle Search Input
    const handleSearch = (text: string) => {
        setSearchQuery(text);
        filterReports(reports, text, selectedStatus);
    };

    // Handle Status Selection
    const handleStatusSelect = (status: string | null) => {
        const newStatus = selectedStatus === status ? null : status; // Toggle
        setSelectedStatus(newStatus);
        filterReports(reports, searchQuery, newStatus);
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Memuat laporan saya...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Laporan Saya</Text>
            </View>

            <FlatList
                data={filteredReports}
                renderItem={({ item }) => (
                    <ReportCard
                        report={item}
                        onPress={() => router.push({ pathname: "/(tabs)/report-detail", params: { id: item.id } })}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <FilterHeader
                        searchQuery={searchQuery}
                        onSearchChange={handleSearch}
                        selectedStatus={selectedStatus}
                        onStatusSelect={handleStatusSelect}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        {error ? (
                            <>
                                <Text style={styles.errorIcon}>❌</Text>
                                <Text style={styles.errorText}>{error}</Text>
                                <TouchableOpacity onPress={fetchMyReports} style={styles.retryButton}>
                                    <Text style={styles.retryText}>Coba Lagi</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.emptyIcon}>📝</Text>
                                <Text style={styles.emptyText}>
                                    {searchQuery || selectedStatus
                                        ? "Tidak ada laporan yang sesuai filter"
                                        : "Belum ada laporan yang dibuat"}
                                </Text>
                            </>
                        )}
                    </View>
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.gray[50],
    },
    header: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.gray[900],
    },
    headerContainer: {
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        marginBottom: 12,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 8,
        color: COLORS.gray[400],
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: COLORS.gray[800],
    },
    clearIcon: {
        fontSize: 14,
        color: COLORS.gray[400],
        padding: 4,
    },
    filterContainer: {
        flexGrow: 0,
    },
    filterContent: {
        paddingRight: 16,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterChipText: {
        fontSize: 13,
        color: COLORS.gray[600],
    },
    filterChipTextActive: {
        color: COLORS.white,
        fontWeight: "600",
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
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
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyText: {
        color: COLORS.gray[500],
        fontSize: 14,
        textAlign: "center",
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorText: {
        color: COLORS.gray[600],
        fontSize: 14,
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
    },
    retryText: {
        color: COLORS.white,
        fontWeight: "600",
    },
});
