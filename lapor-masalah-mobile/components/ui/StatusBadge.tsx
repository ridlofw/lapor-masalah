import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatusBadgeProps {
    status: string;
    size?: "sm" | "md";
}

const STATUS_CONFIG: Record<string, { label: string; bgColor: string; textColor: string }> = {
    MENUNGGU_VERIFIKASI: { label: "Menunggu", bgColor: "#FEF3C7", textColor: "#92400E" },
    DIDISPOSISIKAN: { label: "Didisposisikan", bgColor: "#DBEAFE", textColor: "#1E40AF" },
    DIVERIFIKASI_DINAS: { label: "Diverifikasi", bgColor: "#E0E7FF", textColor: "#3730A3" },
    DALAM_PENGERJAAN: { label: "Dalam Pengerjaan", bgColor: "#EDE9FE", textColor: "#5B21B6" },
    SELESAI: { label: "Selesai", bgColor: "#D1FAE5", textColor: "#065F46" },
    DITOLAK: { label: "Ditolak", bgColor: "#FEE2E2", textColor: "#991B1B" },
    DITOLAK_DINAS: { label: "Ditolak Dinas", bgColor: "#FEE2E2", textColor: "#991B1B" },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status] || {
        label: status,
        bgColor: "#F3F4F6",
        textColor: "#374151",
    };

    const isSmall = size === "sm";

    return (
        <View
            style={[
                styles.badge,
                isSmall ? styles.badgeSm : styles.badgeMd,
                { backgroundColor: config.bgColor },
            ]}
        >
            <Text
                style={[
                    styles.text,
                    isSmall ? styles.textSm : styles.textMd,
                    { color: config.textColor },
                ]}
            >
                {config.label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        borderRadius: 999,
    },
    badgeSm: {
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    badgeMd: {
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    text: {
        fontWeight: "500",
    },
    textSm: {
        fontSize: 10,
    },
    textMd: {
        fontSize: 12,
    },
});
