import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input } from "@/components/ui";
import { COLORS } from "@/constants/config";

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = "Email harus diisi";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Format email tidak valid";
        }

        if (!password) {
            newErrors.password = "Password harus diisi";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await login(email, password);
            router.replace("/(tabs)");
        } catch (error) {
            Alert.alert(
                "Login Gagal",
                error instanceof Error ? error.message : "Terjadi kesalahan saat login"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.flex}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Selamat Datang 👋</Text>
                        <Text style={styles.subtitle}>
                            Masuk untuk melaporkan masalah di sekitar Anda
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Input
                            label="Email"
                            placeholder="contoh@email.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            placeholder="Masukkan password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            error={errors.password}
                            rightIcon={
                                <Text style={styles.togglePassword}>
                                    {showPassword ? "Sembunyikan" : "Tampilkan"}
                                </Text>
                            }
                            onRightIconPress={() => setShowPassword(!showPassword)}
                        />

                        <Button
                            title="Masuk"
                            onPress={handleLogin}
                            loading={loading}
                            style={styles.loginButton}
                        />
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Belum punya akun? </Text>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity>
                                <Text style={styles.footerLink}>Daftar</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    header: {
        paddingTop: 48,
        paddingBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.gray[900],
        marginBottom: 8,
    },
    subtitle: {
        color: COLORS.gray[500],
        fontSize: 18,
    },
    form: {
        flex: 1,
    },
    togglePassword: {
        color: COLORS.primary,
        fontSize: 14,
    },
    loginButton: {
        marginTop: 24,
    },
    footer: {
        paddingVertical: 32,
        flexDirection: "row",
        justifyContent: "center",
    },
    footerText: {
        color: COLORS.gray[500],
    },
    footerLink: {
        color: COLORS.primary,
        fontWeight: "600",
    },
});
