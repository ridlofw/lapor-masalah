# Lapor Masalah - Mobile App

Aplikasi Android untuk melaporkan masalah infrastruktur. Dibangun dengan React Native (Expo).

## 📱 Fitur

- ✅ Login / Daftar akun
- ✅ Buat laporan baru dengan kategori, deskripsi, lokasi, dan foto
- ✅ Lihat daftar laporan yang sudah dibuat
- ✅ Lokasi otomatis menggunakan GPS
- ✅ Upload foto dari galeri atau kamera

## 🛠️ Setup Development

### Prasyarat

1. **Node.js** (v18 atau lebih baru)
2. **Expo Go** app di HP Android (download dari Play Store)
3. Website backend berjalan di `http://localhost:3000`

### Langkah-langkah

1. **Install dependencies:**
   ```bash
   cd lapor-masalah-mobile
   npm install
   ```

2. **Jalankan website backend** (di terminal terpisah):
   ```bash
   cd ..  # ke folder lapor-masalah
   npm run dev
   ```

3. **Update API URL** (untuk testing di HP fisik):
   
   Edit file `constants/config.ts`:
   ```typescript
   // Ganti localhost dengan IP komputer Anda
   // Cari IP dengan menjalankan `ipconfig` di cmd
   export const API_URL = "http://192.168.x.x:3000";
   ```

4. **Jalankan aplikasi:**
   ```bash
   npm start
   ```

5. **Scan QR code** dengan aplikasi Expo Go di HP Android Anda.

## 📦 Build APK

Untuk membuat file APK yang bisa diinstall:

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login ke Expo:**
   ```bash
   eas login
   ```

3. **Build APK:**
   ```bash
   eas build --platform android --profile preview
   ```

4. Download APK dari link yang diberikan setelah build selesai.

## 🚀 Deploy Production

Saat website sudah di-deploy, update `constants/config.ts`:

```typescript
// Production
export const API_URL = "https://your-website.vercel.app";
```

Kemudian build ulang APK.

## 📁 Struktur Folder

```
lapor-masalah-mobile/
├── app/                    # Screens (Expo Router)
│   ├── (auth)/             # Login & Register
│   ├── (tabs)/             # Main app tabs
│   ├── _layout.tsx         # Root layout
│   └── index.tsx           # Entry redirect
├── components/             # Reusable components
│   ├── ui/                 # Button, Input, Card, etc.
│   └── CategoryPicker.tsx
├── contexts/               # React contexts
│   └── AuthContext.tsx
├── services/               # API services
│   └── api.ts
├── constants/              # Config & constants
│   └── config.ts
├── utils/                  # Utilities
│   └── storage.ts
└── assets/                 # Images & icons
```

## 🔧 Troubleshooting

### "Network request failed"
- Pastikan website backend berjalan
- Pastikan HP dan komputer di jaringan WiFi yang sama
- Gunakan IP lokal komputer, bukan `localhost`

### "Unable to resolve module"
```bash
npm start --clear
```

### Expo Go tidak bisa scan QR
- Gunakan mode tunnel: `npx expo start --tunnel`
