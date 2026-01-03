import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { COLORS } from "@/constants/config";

interface CardProps extends ViewProps {
    children: React.ReactNode;
    variant?: "default" | "elevated";
}

export function Card({
    children,
    variant = "default",
    style,
    ...props
}: CardProps) {
    return (
        <View
            style={[
                styles.base,
                variant === "elevated" ? styles.elevated : styles.default,
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
    },
    default: {
        borderWidth: 1,
        borderColor: COLORS.gray[100],
    },
    elevated: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
});
