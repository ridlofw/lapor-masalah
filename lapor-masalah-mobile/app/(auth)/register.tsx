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

export default function RegisterScreen() {
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        phone?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!name) {
            newErrors.name = "Nama harus diisi";
        }

        if (!email) {
            newErrors.email = "Email harus diisi";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Format email tidak valid";
        }

        if (!password) {
            newErrors.password = "Password harus diisi";
        } else if (password.length < 6) {
            newErrors.password = "Password minimal 6 karakter";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Konfirmasi password harus diisi";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Password tidak cocok";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await register(name, email, password, phone || undefined);
            router.replace("/(tabs)");
        } catch (error) {
            Alert.alert(
                "Registrasi Gagal",
                error instanceof Error ? error.message : "Terjadi kesalahan saat mendaftar"
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
                        <Text style={styles.title}>Buat Akun Baru 📝</Text>
                        <Text style={styles.subtitle}>
                            Daftar untuk mulai melaporkan masalah
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Input
                            label="Nama Lengkap"
                            placeholder="Masukkan nama lengkap"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            error={errors.name}
                        />

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
                            label="Nomor Telepon (Opsional)"
                            placeholder="08xxxxxxxxxx"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            error={errors.phone}
                        />

                        <Input
                            label="Password"
                            placeholder="Minimal 6 karakter"
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

                        <Input
                            label="Konfirmasi Password"
                            placeholder="Ulangi password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            error={errors.confirmPassword}
                        />

                        <Button
                            title="Daftar"
                            onPress={handleRegister}
                            loading={loading}
                            style={styles.registerButton}
                        />
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Sudah punya akun? </Text>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity>
                                <Text style={styles.footerLink}>Masuk</Text>
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
        paddingTop: 32,
        paddingBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.gray[900],
        marginBottom: 8,
    },
    subtitle: {
        color: COLORS.gray[500],
        fontSize: 16,
    },
    form: {
        flex: 1,
    },
    togglePassword: {
        color: COLORS.primary,
        fontSize: 14,
    },
    registerButton: {
        marginTop: 16,
    },
    footer: {
        paddingVertical: 24,
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
