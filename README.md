<div align="center">

# 🏛️ Lapor Masalah

### Platform Pelaporan Masalah Infrastruktur Publik

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql)](https://supabase.com/)
[![Expo](https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo)](https://expo.dev/)

*Sampaikan aspirasi dan laporan masalah infrastruktur di lingkungan Anda.*
*Kami pastikan setiap laporan didengar dan ditindaklanjuti.*

[🚀 Demo](#demo) • [📖 Dokumentasi](#dokumentasi) • [🛠️ Instalasi](#instalasi) • [📱 Mobile App](#aplikasi-mobile)

</div>

---

## 📋 Deskripsi Aplikasi

**Lapor Masalah** adalah platform pelaporan masalah infrastruktur publik yang menghubungkan warga dengan pemerintah daerah. Aplikasi ini memungkinkan masyarakat untuk melaporkan kerusakan infrastruktur (jalan, jembatan, sekolah, fasilitas kesehatan, air, dan listrik) secara digital dengan lokasi GPS yang akurat.

### ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 📝 **Pelaporan Digital** | Warga dapat membuat laporan dengan foto bukti, deskripsi, dan lokasi GPS |
| 🗺️ **Peta Interaktif** | Visualisasi laporan pada peta menggunakan Leaflet |
| 📊 **Dashboard Admin** | Panel admin untuk verifikasi dan disposisi laporan ke dinas |
| 🏢 **Dashboard Dinas** | Panel dinas untuk mengelola laporan, update progress, dan anggaran |
| 📱 **Aplikasi Mobile** | Aplikasi Android/iOS menggunakan Expo/React Native |
| 📲 **Lapor via SMS** | Pelaporan tanpa internet melalui SMS Gateway |
| 👍 **Dukungan Warga** | Fitur support untuk laporan dari warga lain |
| ⏱️ **Timeline Tracking** | Lacak progress laporan dari awal hingga selesai |

### 🔄 Alur Kerja Sistem

```mermaid
graph LR
    A[Warga] -->|Membuat Laporan| B[Menunggu Verifikasi]
    B -->|Verifikasi Admin| C[Didisposisikan ke Dinas]
    C -->|Verifikasi Dinas| D[Dalam Pengerjaan]
    D -->|Update Progress| E[Selesai]
    B -->|Ditolak| F[Laporan Ditolak]
```

### 👥 Multi-Role System

| Role | Akses & Kemampuan |
|------|-------------------|
| **👤 User (Warga)** | Membuat laporan, melihat status, mendukung laporan warga lain |
| **👨‍💼 Admin** | Verifikasi laporan, disposisi ke dinas terkait, dashboard statistik |
| **🏛️ Dinas** | Kelola laporan, update progress, atur anggaran, tandai selesai |

---

## 🛠️ Tech Stack

### 🌐 Web Application

| Kategori | Teknologi | Kegunaan |
|----------|-----------|----------|
| **Framework** | Next.js 16 (App Router) | Full-stack React framework dengan Server Components |
| **UI Library** | React 19 | Library UI dengan concurrent features |
| **Bahasa** | TypeScript 5 | Type-safe JavaScript |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **UI Components** | Radix UI | Headless accessible components |
| **Database** | PostgreSQL (Supabase) | Relational database dengan BaaS |
| **ORM** | Prisma 6 | Type-safe database client |
| **Maps** | Leaflet | Peta interaktif open-source |
| **Charts** | Recharts | Library grafik berbasis React |
| **Auth** | bcryptjs + Custom Cookies | Password hashing & session management |

### 📱 Mobile Application

| Kategori | Teknologi | Kegunaan |
|----------|-----------|----------|
| **Framework** | Expo 54 | React Native development platform |
| **UI** | React Native 0.81 | Cross-platform mobile UI |
| **Styling** | NativeWind | Tailwind CSS untuk React Native |
| **Navigation** | Expo Router | File-based routing |
| **Storage** | Async Storage & Secure Store | Local data persistence |
| **Camera** | Expo Image Picker | Pengambilan foto laporan |
| **Location** | Expo Location | GPS untuk lokasi laporan |

---

## 🚀 Instalasi

### 📋 Prasyarat

- **Node.js** >= 18.17
- **npm** atau **yarn** atau **pnpm**
- **Git**
- Akun **Supabase** (untuk database)

### 📥 Clone Repository

```bash
git clone https://github.com/ridlofw/lapor-masalah.git
cd lapor-masalah
```

### 🌐 Setup Web Application

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Konfigurasi Environment Variables**
   
   Buat file `.env` di root directory:
   ```env
   # Database (Supabase PostgreSQL)
   DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
   
   # Supabase Client
   NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="[your-service-role-key]"
   ```

3. **Setup Database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Push schema ke database
   npm run db:push
   
   # Seed data awal (opsional)
   npm run db:seed
   ```

### 📱 Setup Mobile Application

```bash
# Masuk ke direktori mobile
cd lapor-masalah-mobile

# Install dependencies
npm install

# Konfigurasi API URL
# Edit file constants/index.ts untuk mengarahkan ke backend Anda
```

---

## ▶️ Menjalankan Aplikasi

### 🌐 Web Application

```bash
# Development mode
npm run dev

# Build production
npm run build

# Start production
npm start
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 📱 Mobile Application

```bash
cd lapor-masalah-mobile

# Start Expo development server
npm start

# Atau langsung ke Android
npm run android

# Atau langsung ke iOS
npm run ios

# Build APK (Android)
npm run build:android
```

### 🗄️ Database Tools

```bash
# Prisma Studio (GUI untuk melihat/edit data)
npm run db:studio

# Push perubahan schema
npm run db:push

# Seed database dengan data sample
npm run db:seed
```

## 📚 Dokumentasi API

### 🔐 Authentication

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/auth/register` | Registrasi user baru |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/logout` | Logout user |
| `GET` | `/api/auth/me` | Get current user info |

#### Login Request
```json
POST /api/auth/login
{
  "email": "warga@example.com",
  "password": "user123"
}
```

#### Login Response
```json
{
  "success": true,
  "user": {
    "id": "cuid...",
    "email": "warga@example.com",
    "name": "Budi Santoso",
    "role": "USER",
    "avatar": null
  }
}
```

---

### 📋 Reports (Laporan)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/reports` | Get semua laporan publik | ❌ |
| `POST` | `/api/reports` | Buat laporan baru | ✅ User |
| `GET` | `/api/reports/[id]` | Get detail laporan | ❌ |
| `GET` | `/api/reports/mine` | Get laporan milik user | ✅ User |
| `POST` | `/api/reports/[id]/support` | Dukung laporan | ✅ User |

#### Get Reports dengan Filter
```bash
GET /api/reports?category=JALAN&status=MENUNGGU_VERIFIKASI&search=lubang&sort=latest&page=1&limit=10
```

#### Query Parameters

| Parameter | Nilai | Deskripsi |
|-----------|-------|-----------|
| `category` | `JALAN`, `JEMBATAN`, `SEKOLAH`, `KESEHATAN`, `AIR`, `LISTRIK` | Filter kategori |
| `status` | `MENUNGGU_VERIFIKASI`, `DIDISPOSISIKAN`, `DITOLAK`, `DALAM_PENGERJAAN`, `SELESAI` | Filter status |
| `search` | string | Pencarian di deskripsi/lokasi |
| `sort` | `latest`, `oldest`, `support` | Urutan |
| `page` | number | Halaman (default: 1) |
| `limit` | number | Jumlah per halaman (default: 10) |

#### Create Report Request
```json
POST /api/reports
{
  "category": "JALAN",
  "description": "Jalan berlubang besar di depan gang 5",
  "locationText": "Jl. Raya Sukamaju No. 45",
  "latitude": -6.2884,
  "longitude": 106.7984,
  "images": ["https://supabase.../image1.jpg"]
}
```

---

### 👨‍💼 Admin Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/admin/reports` | Get laporan pending verifikasi |
| `POST` | `/api/admin/reports/[id]/verify` | Verifikasi & disposisi laporan |
| `POST` | `/api/admin/reports/[id]/reject` | Tolak laporan |
| `GET` | `/api/admin/stats` | Statistik dashboard admin |

#### Verify & Dispose Report
```json
POST /api/admin/reports/[id]/verify
{
  "dinasType": "PUPR",
  "note": "Laporan valid, diteruskan ke Dinas PUPR"
}
```

---

### 🏛️ Dinas Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/dinas/reports` | Get laporan untuk dinas |
| `POST` | `/api/dinas/reports/[id]/verify` | Verifikasi laporan dinas |
| `POST` | `/api/dinas/reports/[id]/budget` | Set anggaran |
| `POST` | `/api/dinas/reports/[id]/progress` | Update progress |
| `POST` | `/api/dinas/reports/[id]/complete` | Tandai selesai |
| `GET` | `/api/dinas/stats` | Statistik dashboard dinas |

#### Update Progress
```json
POST /api/dinas/reports/[id]/progress
{
  "description": "Pengerjaan perbaikan jalan sudah 50%",
  "budgetUsed": 5000000,
  "images": ["https://supabase.../progress1.jpg"]
}
```

---

### 📲 SMS Gateway

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/sms` | Terima laporan via SMS |

#### SMS Format
```
LAPOR#KATEGORI#LOKASI#DESKRIPSI
```

#### Contoh SMS
```
LAPOR#JALAN#Jl. Sudirman No 10#Jalan berlubang cukup dalam sudah 1 minggu
```

| Kategori Valid |
|----------------|
| `JALAN`, `JEMBATAN`, `SEKOLAH`, `KESEHATAN`, `AIR`, `LISTRIK` |

---

### 📤 File Upload

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/upload` | Upload gambar ke Supabase Storage |

#### Upload Request (multipart/form-data)
```bash
curl -X POST /api/upload \
  -F "file=@photo.jpg"
```

#### Upload Response
```json
{
  "success": true,
  "url": "https://[project].supabase.co/storage/v1/object/public/reports/abc123.jpg"
}
```

---

## 🗃️ Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Report : "membuat"
    User ||--o{ Support : "mendukung"
    User }o--|| Dinas : "anggota (jika DINAS)"
    
    Dinas ||--o{ Report : "menangani"
    
    Report ||--o{ ReportImage : "memiliki"
    Report ||--o{ ReportTimeline : "memiliki"
    Report ||--o{ ReportProgress : "memiliki"
    Report ||--o{ Support : "memiliki"
    
    ReportProgress ||--o{ ProgressImage : "memiliki"
```

### Kategori Laporan

| Kode | Nama | Dinas Terkait |
|------|------|---------------|
| `JALAN` | Jalan | PUPR |
| `JEMBATAN` | Jembatan | PUPR |
| `SEKOLAH` | Sekolah | DIKNAS |
| `KESEHATAN` | Fasilitas Kesehatan | DINKES |
| `AIR` | Air | ESDM |
| `LISTRIK` | Listrik | ESDM |

### Status Laporan

| Status | Deskripsi |
|--------|-----------|
| `MENUNGGU_VERIFIKASI` | Laporan baru, menunggu verifikasi admin |
| `DIDISPOSISIKAN` | Sudah didisposisi ke dinas terkait |
| `DITOLAK` | Ditolak oleh admin |
| `DITOLAK_DINAS` | Ditolak oleh dinas |
| `DIVERIFIKASI_DINAS` | Diverifikasi oleh dinas |
| `DALAM_PENGERJAAN` | Sedang dalam proses pengerjaan |
| `SELESAI` | Laporan selesai ditangani |

---

## 📁 Struktur Proyek

```
lapor-masalah/
├── 📂 app/                    # Next.js App Router
│   ├── 📂 api/                # API Routes
│   │   ├── 📂 admin/          # Admin endpoints
│   │   ├── 📂 auth/           # Authentication endpoints
│   │   ├── 📂 dinas/          # Dinas endpoints
│   │   ├── 📂 reports/        # Reports endpoints
│   │   ├── 📂 sms/            # SMS Gateway
│   │   └── 📂 upload/         # File upload
│   ├── 📂 admin/              # Admin dashboard pages
│   ├── 📂 dinas/              # Dinas dashboard pages
│   ├── 📂 jelajah/            # Browse reports page
│   ├── 📂 lapor/              # Create report page
│   ├── 📂 laporan/            # Report detail page
│   └── 📂 laporan-saya/       # My reports page
├── 📂 components/             # React components
│   ├── 📂 admin/              # Admin-specific components
│   ├── 📂 dashboard/          # Dashboard components
│   ├── 📂 dinas/              # Dinas-specific components
│   ├── 📂 jelajah/            # Browse page components
│   ├── 📂 map/                # Map components
│   ├── 📂 report/             # Report components
│   └── 📂 ui/                 # Reusable UI components
├── 📂 lib/                    # Utility libraries
│   ├── 📄 auth.ts             # Authentication utilities
│   ├── 📄 prisma.ts           # Prisma client
│   └── 📄 supabase.ts         # Supabase client
├── 📂 prisma/                 # Database schema & seed
│   ├── 📄 schema.prisma       # Database schema
│   └── 📄 seed.ts             # Seed data
├── 📂 public/                 # Static assets
├── 📂 docs/                   # Technical documentation
│
└── 📂 lapor-masalah-mobile/   # Mobile app (Expo)
    ├── 📂 app/                # Expo Router screens
    ├── 📂 components/         # React Native components
    ├── 📂 contexts/           # React contexts
    ├── 📂 services/           # API services
    └── 📂 utils/              # Utilities
```

---

## 🤝 Contributing

Kontribusi sangat diterima! Silakan buat Pull Request atau buka Issue untuk diskusi fitur baru.

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License.

---

<div align="center">

**Made with ❤️ by Lapor Masalah Team**

[⬆ Kembali ke atas](#-lapor-masalah)

</div>
