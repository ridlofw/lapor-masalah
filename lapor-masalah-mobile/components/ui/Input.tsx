import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { COLORS } from "@/constants/config";

interface InputProps extends Omit<TextInputProps, 'style'> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    inputStyle?: TextInputProps['style'];
}

export function Input({
    label,
    error,
    icon,
    rightIcon,
    onRightIconPress,
    inputStyle,
    multiline = false,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    multiline && styles.inputContainerMultiline,
                    error
                        ? styles.inputError
                        : isFocused
                            ? styles.inputFocused
                            : styles.inputNormal,
                ]}
            >
                {icon && <View style={styles.iconLeft}>{icon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        multiline && styles.inputMultiline,
                        inputStyle,
                    ]}
                    placeholderTextColor={COLORS.gray[400]}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    multiline={multiline}
                    textAlignVertical={multiline ? "top" : "center"}
                    {...props}
                />
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} style={styles.iconRight}>
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
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
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.gray[50],
        borderRadius: 12,
        borderWidth: 2,
        paddingHorizontal: 16,
    },
    inputContainerMultiline: {
        alignItems: "flex-start",
        minHeight: 100,
    },
    inputNormal: {
        borderColor: COLORS.gray[200],
    },
    inputFocused: {
        borderColor: COLORS.primary,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    iconLeft: {
        marginRight: 12,
    },
    iconRight: {
        marginLeft: 8,
        padding: 4,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        color: COLORS.gray[900],
        fontSize: 16,
    },
    inputMultiline: {
        minHeight: 80,
        paddingTop: 12,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 14,
        marginTop: 4,
    },
});
