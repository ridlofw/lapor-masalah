# Dokumentasi Teknis: Lapor Masalah

## 1. Arsitektur Sistem

Aplikasi **Lapor Masalah** dibangun menggunakan arsitektur web full-stack modern, memanfaatkan **Next.js** (App Router) sebagai framework utama, **Supabase** untuk kemampuan Backend-as-a-Service (BaaS) (Database, Auth, Storage), dan **Prisma** sebagai Object-Relational Mapper (ORM).

### Arsitektur Tingkat Tinggi

```mermaid
graph TD
    Client[Browser Klien]
    
    subgraph Frontend_Server [Server Next.js]
        AppRouter[App Router]
        ServerActions[Server Actions]
        API[API Routes]
    end
    
    subgraph Database_Layer [Data Layer]
        Prisma[Prisma Client]
        AuthLib[Library Auth]
    end
    
    subgraph External_Services [Layanan Eksternal]
        SupabaseDB[(Supabase PostgreSQL)]
        SupabaseStorage[Supabase Storage]
    end

    Client -->|HTTP / React Server Components| AppRouter
    Client -->|Submit Form| ServerActions
    AppRouter --> Prisma
    ServerActions --> Prisma
    ServerActions --> AuthLib
    API --> Prisma
    
    Prisma -->|Query| SupabaseDB
    
    Client -->|Upload Langsung (Opsional)| SupabaseStorage
    ServerActions -->|Manajemen Upload| SupabaseStorage
```

### Ringkasan Komponen

*   **Frontend (Next.js)**: 
    *   Menggunakan **React Server Components (RSC)** untuk performa muat awal dan SEO yang lebih baik.
    *   **Client Components** digunakan untuk elemen interaktif (form, peta, UI dinamis).
    *   **Tailwind CSS** menyediakan styling berbasis utility (utility-first).
    *   **Radix UI** primitives berfungsi sebagai fondasi untuk komponen UI yang aksesibel.

*   **Backend (Next.js + Server Actions)**:
    *   **Server Actions**: Menangani mutasi data (contoh: mengirim laporan, update status) langsung dari komponen frontend, memberikan pengalaman yang mulus seperti RPC.
    *   **API Routes (folder `app/api`)**: Menyediakan endpoint REST untuk integrasi spesifik atau kebutuhan pengambilan data di mana Server Actions tidak cocok.
    *   **Autentikasi**: Manajemen sesi kustom yang mengimplementasikan kontrol akses berbasis peran (User, Admin, Dinas).

*   **Database (Supabase PostgreSQL)**:
    *   Database PostgreSQL terkelola yang di-host oleh Supabase.
    *   Menggunakan **Prisma ORM** untuk interaksi database yang aman secara tipe (type-safe), migrasi skema, dan pembuatan query.

---

## 2. Tech Stack & Rasional

| Kategori | Teknologi | Rasional |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16** | Dipilih karena App Router yang kuat, Server Actions, optimasi bawaan (Image, Font), dan integrasi mulus dengan React Server Components. Ini menyederhanakan alur kerja full-stack. |
| **Bahasa** | **TypeScript 5** | Memastikan keamanan tipe (type safety) di seluruh aplikasi, mengurangi error saat runtime, dan meningkatkan produktivitas developer dengan dukungan IDE yang lebih baik. |
| **Database** | **PostgreSQL (Supabase)** | Database relasional yang tangguh. Supabase menyediakan instance terkelola dengan overhead sangat rendah, ditambah tool bawaan seperti editor tabel dan SQL. |
| **ORM** | **Prisma 6** | Menyediakan bahasa pemodelan data yang intuitif (`schema.prisma`) dan klien query yang type-safe. Menyederhanakan join kompleks dan migrasi dibandingkan menulis SQL mentah. |
| **Styling** | **Tailwind CSS 4** | Framework CSS utility-first yang mempercepat pengembangan UI. Versi 4 (jika dikonfigurasi) membawa peningkatan performa. |
| **UI Library** | **Radix UI** | Primitives UI headless yang menangani logika aksesibilitas (a11y) yang kompleks, memungkinkan kita membuat styling komponen yang sepenuhnya kustom. |
| **Peta** | **Leaflet / React-Leaflet** | Library open-source ringan untuk peta interaktif, esensial untuk fitur "Lokasi" dalam pelaporan masalah. |
| **Grafik** | **Recharts** | Library charting yang fleksibel dibangun di atas komponen React, digunakan untuk dashboard Admin/Dinas untuk memvisualisasikan statistik laporan. |
| **Auth** | **Bcryptjs + Custom Cookies** | Menyediakan hashing password yang aman dan manajemen sesi yang fleksibel tanpa terkunci pada satu vendor (vendor lock-in), sambil tetap menyimpan data user di database sendiri. |

---

## 3. Skema Database

Database dinormalisasi dan dirancang untuk mendukung alur kerja berbasis peran (User -> Admin -> Dinas).

### 3.1 Diagram Hubungan Entitas (ERD)

```mermaid
erDiagram
    User ||--o{ Report : "laporan"
    User ||--o{ ReportTimeline : "timeline"
    User ||--o{ Support : "dukungan"
    User ||--o{ ReportProgress : "update_progress"
    User }o--|| Dinas : "milik (jika role=DINAS)"
    
    Dinas ||--o{ Report : "menerima"
    Dinas ||--o{ User : "memiliki anggota"
    
    Report ||--o{ ReportImage : "memiliki gambar"
    Report ||--o{ ReportTimeline : "memiliki riwayat"
    Report ||--o{ ReportProgress : "memiliki progress"
    Report ||--o{ Support : "memiliki dukungan"
    Report }o--|| User : "dibuat oleh"
    Report }o--|| Dinas : "ditugaskan ke"
    
    ReportProgress ||--o{ ProgressImage : "memiliki gambar"
    ReportProgress }o--|| User : "diperbarui oleh"
```

### 3.2 Model Utama

#### `User`
Menyimpan informasi akun.
- `role`: Enum (`USER`, `ADMIN`, `DINAS`).
- `dinasId`: Menghubungkan user dengan dinas tertentu jika role mereka adalah `DINAS`.

#### `Report`
Entitas inti yang merepresentasikan laporan masalah.
- `status`: Enum yang melacak siklus hidup (`MENUNGGU_VERIFIKASI` -> `DALAM_PENGERJAAN` -> `SELESAI`, dll).
- `category`: Enum (`JALAN`, `JEMBATAN`, dll).
- `location`: Menyimpan teks dan koordinat (`latitude`, `longitude`).
- `budget`: Melacak `budgetTotal` (total anggaran) dan `budgetUsed` (anggaran terpakai).

#### `ReportTimeline`
Log audit untuk setiap tindakan utama yang diambil pada sebuah laporan.
- `eventType`: Enum (`CREATED`, `VERIFIED_ADMIN`, `DISPOSED_TO_DINAS`, `COMPLETED`, dll).
- `actorId`: User yang melakukan tindakan.

#### `Dinas`
Merepresentasikan departemen yang menangani laporan.
- `type`: Enum (`PUPR`, `DIKNAS`, `DINKES`, `ESDM`).

---

## 4. Panduan Setup Pengembangan

Ikuti langkah-langkah ini untuk mengatur lingkungan pengembangan secara lokal.

### 4.1 Prasyarat
- **Node.js**: Versi 18.17 atau lebih baru.
- **npm**: Terinstal bersama Node.js.
- **Git**: Untuk version control.

### 4.2 Instalasi

1.  **Clone repository**:
    ```bash
    git clone https://github.com/ridlofw/lapor-masalah.git
    cd lapor-masalah
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### 4.3 Konfigurasi

1.  **Environment Variables**:
    Buat file `.env` di direktori root. Anda memerlukan key berikut (minta ke team lead atau cek dashboard Supabase):

    ```env
    # Koneksi Database (Supabase Transaction Pooler)
    DATABASE_URL="postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

    # Koneksi Langsung (Supabase Session Pooler / IPv4)
    DIRECT_URL="postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

    # Supabase Client
    NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="[your-anon-key]"
    ```
    *Catatan: Project ini juga mendukung Default Publishable Key di `lib/supabase.ts` untuk mulai cepat jika dikonfigurasi.*

### 4.4 Setup Database

1.  **Generate Prisma Client**:
    ```bash
    npx prisma generate
    ```

2.  **Push Skema ke Database** (jika menggunakan DB dev lokal) atau **Verifikasi Koneksi**:
    ```bash
    npm run db:push
    ```
    *Peringatan: `db:push` mensinkronkan skema. Di produksi atau environment dev bersama, gunakan migrasi ketat.*

3.  **Seed Database**:
    Isi database dengan user awal (Admin, Dinas) dan laporan dummy.
    ```bash
    npm run db:seed
    ```
    *Cek `prisma/seed.ts` untuk melihat akun default yang dibuat.*

### 4.5 Menjalankan Aplikasi

1.  **Jalankan Development Server**:
    ```bash
    npm run dev
    ```

2.  **Akses Aplikasi**:
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

3.  **Prisma Studio** (Opsional):
    Untuk melihat dan mengedit data database melalui GUI:
    ```bash
    npm run db:studio
    ```
