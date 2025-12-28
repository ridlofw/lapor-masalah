"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldCheck, User, ArrowRight, Eye, EyeOff } from "lucide-react"

export default function AdminLoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Username atau password salah")
                setIsLoading(false)
                return
            }

            if (data.user.role !== "ADMIN") {
                setError("Akun ini bukan akun admin")
                setIsLoading(false)
                return
            }

            router.push("/admin/dashboard")
        } catch {
            setError("Terjadi kesalahan saat login")
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left: Branding & Visuals */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

                {/* Animated Blobs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] animate-pulse duration-[4000ms]" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px] animate-pulse delay-1000 duration-[5000ms]" />

                <div className="relative z-10 px-12 animate-in slide-in-from-bottom-10 fade-in duration-1000">
                    <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-3xl shadow-2xl">
                        <div className="h-20 w-20 mb-6 rounded-2xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30 shadow-inner shadow-blue-500/20">
                            <ShieldCheck className="h-10 w-10 text-blue-400" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
                            Admin Portal
                        </h1>
                        <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                            Pusat kendali terpadu untuk pemantauan infrastruktur dan manajemen layanan publik secara real-time.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 animate-in fade-in duration-700 slide-in-from-right-8">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl font-bold tracking-tight">Selamat Datang</h2>
                        <p className="text-muted-foreground mt-2">
                            Masuk untuk mengakses dashboard admin
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <Alert variant="destructive" className="animate-in zoom-in-95">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                    id="username"
                                    placeholder="Masukkan username"
                                    className="pl-9 focus-visible:ring-blue-600"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
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

                        <Button className="w-full bg-blue-600 hover:bg-blue-700 group" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                "Memproses..."
                            ) : (
                                <span className="flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Masuk <ArrowRight className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Mengalami kendala login?{" "}
                        <a href="mailto:111202416059@dinus.ac.id" className="font-medium text-blue-600 hover:underline hover:text-blue-700 transition-colors">
                            Hubungi Tim IT
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
