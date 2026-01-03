import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { REPORT_CATEGORIES, ReportCategory, COLORS } from "@/constants/config";

interface CategoryPickerProps {
    value: ReportCategory | null;
    onChange: (category: ReportCategory) => void;
    error?: string;
}

export function CategoryPicker({ value, onChange, error }: CategoryPickerProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Kategori Laporan</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {REPORT_CATEGORIES.map((category) => (
                    <TouchableOpacity
                        key={category.value}
                        onPress={() => onChange(category.value)}
                        style={[
                            styles.categoryItem,
                            value === category.value
                                ? styles.categorySelected
                                : styles.categoryUnselected,
                        ]}
                    >
                        <Text style={styles.categoryIcon}>{category.icon}</Text>
                        <Text
                            style={[
                                styles.categoryLabel,
                                value === category.value
                                    ? styles.categoryLabelSelected
                                    : styles.categoryLabelUnselected,
                            ]}
                        >
                            {category.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        color: COLORS.gray[700],
        fontWeight: "500",
        marginBottom: 8,
        fontSize: 14,
    },
    scrollContent: {
        flexDirection: "row",
    },
    categoryItem: {
        marginRight: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 2,
        minWidth: 80,
        alignItems: "center",
    },
    categorySelected: {
        backgroundColor: "#EFF6FF",
        borderColor: COLORS.primary,
    },
    categoryUnselected: {
        backgroundColor: COLORS.gray[50],
        borderColor: COLORS.gray[200],
    },
    categoryIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: "500",
    },
    categoryLabelSelected: {
        color: COLORS.primaryDark,
    },
    categoryLabelUnselected: {
        color: COLORS.gray[500],
    },
    errorText: {
        color: COLORS.error,
        fontSize: 14,
        marginTop: 8,
    },
});
