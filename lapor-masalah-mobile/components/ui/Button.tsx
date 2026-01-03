import React from "react";
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    TouchableOpacityProps,
    View,
    StyleSheet,
} from "react-native";
import { COLORS } from "@/constants/config";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    icon?: React.ReactNode;
}

export function Button({
    title,
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    icon,
    style,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading;

    const getButtonStyle = () => {
        const baseStyle = [styles.base];

        switch (variant) {
            case "primary":
                baseStyle.push(styles.primary);
                break;
            case "secondary":
                baseStyle.push(styles.secondary);
                break;
            case "outline":
                baseStyle.push(styles.outline);
                break;
            case "ghost":
                baseStyle.push(styles.ghost);
                break;
        }

        switch (size) {
            case "sm":
                baseStyle.push(styles.sizeSm);
                break;
            case "md":
                baseStyle.push(styles.sizeMd);
                break;
            case "lg":
                baseStyle.push(styles.sizeLg);
                break;
        }

        if (isDisabled) {
            baseStyle.push(styles.disabled);
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        const textStyle = [styles.text];

        switch (variant) {
            case "primary":
            case "secondary":
                textStyle.push(styles.textLight);
                break;
            case "outline":
            case "ghost":
                textStyle.push(styles.textPrimary);
                break;
        }

        switch (size) {
            case "sm":
                textStyle.push(styles.textSm);
                break;
            case "md":
                textStyle.push(styles.textMd);
                break;
            case "lg":
                textStyle.push(styles.textLg);
                break;
        }

        return textStyle;
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), style]}
            disabled={isDisabled}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === "primary" || variant === "secondary" ? "#fff" : COLORS.primary}
                />
            ) : (
                <>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text style={getTextStyle()}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    },
    primary: {
        backgroundColor: COLORS.primary,
    },
    secondary: {
        backgroundColor: COLORS.secondary,
    },
    outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    ghost: {
        backgroundColor: "transparent",
    },
    sizeSm: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    sizeMd: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    sizeLg: {
        paddingHorizontal: 32,
        paddingVertical: 16,
    },
    disabled: {
        opacity: 0.5,
    },
    iconContainer: {
        marginRight: 8,
    },
    text: {
        fontWeight: "600",
    },
    textLight: {
        color: "#fff",
    },
    textPrimary: {
        color: COLORS.primary,
    },
    textSm: {
        fontSize: 14,
    },
    textMd: {
        fontSize: 16,
    },
    textLg: {
        fontSize: 18,
    },
});
