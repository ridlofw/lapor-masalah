import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { COLORS, REPORT_CATEGORIES } from "@/constants/config";
import { Report } from "@/services/api";
import { StatusBadge } from "@/components/ui";

const { width } = Dimensions.get("window");

interface ReportCardProps {
    report: Report;
    onPress: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onPress }) => {
    const categoryInfo = REPORT_CATEGORIES.find(c => c.value === report.category) || {
        icon: "📋",
        label: report.category
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Image Section */}
            <View style={styles.imageContainer}>
                {report.image ? (
                    <Image source={{ uri: report.image }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderIcon}>{categoryInfo.icon}</Text>
                    </View>
                )}
                <View style={styles.dateBadge}>
                    <Text style={styles.dateText}>{formatDate(report.createdAt)}</Text>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryIcon}>{categoryInfo.icon}</Text>
                        <Text style={styles.categoryText}>{categoryInfo.label}</Text>
                    </View>
                    <StatusBadge status={report.status} />
                </View>

                {/* Location */}
                <View style={styles.locationRow}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.locationText} numberOfLines={1}>
                        {report.locationText}
                    </Text>
                </View>

                {/* Description */}
                <Text style={styles.description} numberOfLines={2}>
                    {report.description}
                </Text>

                {/* Footer: Dinas Info if available */}
                {report.dinas && (
                    <View style={styles.footer}>
                        <Text style={styles.dinasText}>
                            Ditangani oleh {report.dinas.name}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
    },
    imageContainer: {
        height: 150,
        backgroundColor: COLORS.gray[100],
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    placeholderContainer: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.gray[200],
    },
    placeholderIcon: {
        fontSize: 48,
    },
    dateBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    dateText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: "600",
    },
    content: {
        padding: 12,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    categoryBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EFF6FF",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    categoryIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    categoryText: {
        color: COLORS.primaryDark,
        fontSize: 10,
        fontWeight: "600",
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    locationIcon: {
        fontSize: 12,
        marginRight: 4,
        color: COLORS.gray[500],
    },
    locationText: {
        flex: 1,
        color: COLORS.gray[600],
        fontSize: 12,
    },
    description: {
        fontSize: 14,
        color: COLORS.gray[800],
        lineHeight: 20,
        marginBottom: 8,
        fontWeight: "500",
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[100],
        paddingTop: 8,
        marginTop: 4,
    },
    dinasText: {
        fontSize: 11,
        color: COLORS.gray[500],
        fontStyle: "italic",
    },
});
