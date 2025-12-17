"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function PengaturanPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Pengaturan</h3>
                <p className="text-muted-foreground">
                    Kelola profil akun dan preferensi aplikasi Anda.
                </p>
            </div>
            <Separator />

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profil Admin</CardTitle>
                        <CardDescription>
                            Perbarui informasi profil dan alamat email Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input id="name" defaultValue="Admin Lapor Masalah" />
                        </div>
                        <Button>Simpan Perubahan</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Keamanan</CardTitle>
                        <CardDescription>
                            Ubah kata sandi akun Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
                            <Input id="current-password" type="password" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">Kata Sandi Baru</Label>
                            <Input id="new-password" type="password" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Konfirmasi Kata Sandi Baru</Label>
                            <Input id="confirm-password" type="password" />
                        </div>
                        <Button>Update Kata Sandi</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
