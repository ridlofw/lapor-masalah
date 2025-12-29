"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Megaphone, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const { login, isLoading } = useAuth()
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!email || !password) {
            setError("Email atau password tidak boleh kosong")
            return
        }

        const result = await login(email, password)
        if (!result.success) {
            setError(result.error || "Login gagal")
        }
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left: Branding & Visuals */}
            <div className="hidden lg:flex w-1/2 bg-blue-600 relative items-center justify-center overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />

                {/* Animated Blobs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px] animate-pulse duration-[4000ms]" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px] animate-pulse delay-1000 duration-[5000ms]" />

                <div className="relative z-10 px-12 animate-in slide-in-from-bottom-10 fade-in duration-1000">
                    <div className="mb-8">
                        <div className="h-20 w-20 mb-6 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md shadow-xl">
                            <Megaphone className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
                            Lapor Masalah
                        </h1>
                        <p className="text-lg text-blue-100 max-w-md leading-relaxed">
                            Platform pengaduan masyarakat untuk infrastruktur dan pelayanan publik yang lebih baik. Suarakan aspirasi Anda, kami siap melayani.
                        </p>
                    </div>


                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 animate-in fade-in duration-700 slide-in-from-right-8 bg-gray-50/50">
                <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl font-bold tracking-tight text-[#1e293b]">Selamat Datang Kembali</h2>
                        <p className="text-muted-foreground mt-2">
                            Masuk untuk melanjutkan pelaporan masalah
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <Alert variant="destructive" className="animate-in zoom-in-95">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    className="pl-9 focus-visible:ring-blue-600"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="#"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    Lupa password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukkan password"
                                    className="pl-9 pr-10 focus-visible:ring-blue-600"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-blue-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-11 rounded-xl shadow-blue-200 shadow-lg hover:shadow-blue-300 transition-all" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                "Memproses..."
                            ) : (
                                <span className="flex items-center gap-2 group">
                                    Masuk Sekarang <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Belum punya akun?{" "}
                            <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                                Daftar Sekarang
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
