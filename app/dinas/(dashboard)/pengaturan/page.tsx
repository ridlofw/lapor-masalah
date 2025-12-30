

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
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DinasPengaturanPage() {
    const session = await getSession("DINAS")

    if (!session) {
        redirect("/dinas/login")
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Pengaturan</h3>
                <p className="text-muted-foreground">
                    Kelola profil akun dinas dan preferensi aplikasi.
                </p>
            </div>
            <Separator />

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profil Dinas</CardTitle>
                        <CardDescription>
                            Perbarui informasi profil dan alamat email dinas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Dinas</Label>
                            <Input id="name" defaultValue={session.name.replace("Petugas ", "")} />
                        </div>
                        <Button>Simpan Perubahan</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Keamanan</CardTitle>
                        <CardDescription>
                            Ubah kata sandi akun dinas.
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
