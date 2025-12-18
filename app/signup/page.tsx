"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Megaphone, ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react"

export default function SignupPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const { signup, isLoading } = useAuth()
    const router = useRouter()

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Basic validation
        if (password !== confirmPassword) {
            setError("Password tidak sama")
            return
        }

        signup(name, email)
        router.push("/")
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left: Branding & Visuals (Same as Login for consistency) */}
            <div className="hidden lg:flex w-1/2 bg-blue-600 relative items-center justify-center overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />

                {/* Animated Blobs */}
                <div className="absolute top-[20%] right-[20%] w-96 h-96 bg-white/10 rounded-full blur-[100px] animate-pulse duration-[4000ms]" />
                <div className="absolute bottom-[20%] left-[20%] w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px] animate-pulse delay-1000 duration-[5000ms]" />

                <div className="relative z-10 px-12 animate-in slide-in-from-left-10 fade-in duration-1000">
                    <div className="mb-8 relative">
                        <div className="absolute -top-12 -left-12 opacity-50">
                            <Megaphone className="h-64 w-64 text-white/5 rotate-12" />
                        </div>
                        <div className="h-20 w-20 mb-6 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md shadow-xl">
                            <Megaphone className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
                            Gabung Komunitas
                        </h1>
                        <p className="text-lg text-blue-100 max-w-md leading-relaxed">
                            Jadilah bagian dari perubahan. Laporkan masalah di lingkungan Anda dan pantau penyelesaiannya secara transparan.
                        </p>
                    </div>

                    <div className="space-y-4 mt-8">
                        <div className="flex items-center gap-4 text-white/90">
                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                <span className="font-bold">1</span>
                            </div>
                            <p className="font-medium">Daftar akun dalam hitungan detik</p>
                        </div>
                        <div className="flex items-center gap-4 text-white/90">
                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                <span className="font-bold">2</span>
                            </div>
                            <p className="font-medium">Foto dan laporkan masalah</p>
                        </div>
                        <div className="flex items-center gap-4 text-white/90">
                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                <span className="font-bold">3</span>
                            </div>
                            <p className="font-medium">Pantau progress real-time</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Signup Form */}
            <div className="flex-1 flex items-center justify-center p-8 animate-in fade-in duration-700 slide-in-from-right-8 bg-gray-50/50">
                <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl font-bold tracking-tight text-[#1e293b]">Buat Akun Baru</h2>
                        <p className="text-muted-foreground mt-2">
                            Lengkapi data diri untuk mulai melapor
                        </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        {error && (
                            <Alert variant="destructive" className="animate-in zoom-in-95">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Masukkan nama lengkap"
                                    className="pl-9 focus-visible:ring-blue-600"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

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
                            <Label htmlFor="password">Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Buat password"
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

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Ulangi password"
                                    className="pl-9 pr-10 focus-visible:ring-blue-600"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-blue-600 transition-colors focus:outline-none"
                                >
                                    {showConfirmPassword ? (
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
                                    Daftar Akun <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Sudah punya akun?{" "}
                            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                                Masuk Disini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
