// prisma/seed.ts
import { PrismaClient, UserRole, DinasType, ReportCategory, ReportStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // Create Dinas first
    const dinasData = [
        {
            type: DinasType.PUPR,
            name: "Dinas Pekerjaan Umum dan Penataan Ruang",
            description: "Menangani masalah jalan dan jembatan",
        },
        {
            type: DinasType.DIKNAS,
            name: "Dinas Pendidikan",
            description: "Menangani masalah fasilitas sekolah dan pendidikan",
        },
        {
            type: DinasType.DINKES,
            name: "Dinas Kesehatan",
            description: "Menangani masalah fasilitas kesehatan",
        },
        {
            type: DinasType.ESDM,
            name: "Dinas Energi dan Sumber Daya Mineral",
            description: "Menangani masalah air dan listrik",
        },
    ];

    console.log("📁 Creating Dinas...");
    const createdDinas: Record<DinasType, string> = {} as Record<DinasType, string>;

    for (const dinas of dinasData) {
        const created = await prisma.dinas.upsert({
            where: { type: dinas.type },
            update: {},
            create: dinas,
        });
        createdDinas[dinas.type] = created.id;
        console.log(`  ✓ ${dinas.name}`);
    }

    // Hash password
    const adminPassword = await bcrypt.hash("admin", 10);
    const dinasPassword = await bcrypt.hash("dinas", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    // Create Admin
    console.log("👤 Creating Admin...");
    const admin = await prisma.user.upsert({
        where: { email: "admin@lapormasalah.go.id" },
        update: {},
        create: {
            email: "admin@lapormasalah.go.id",
            password: adminPassword,
            name: "Administrator",
            role: UserRole.ADMIN,
        },
    });
    console.log("  ✓ admin@lapormasalah.go.id");

    // Create Dinas Users
    console.log("👥 Creating Dinas Users...");

    const dinasUsers = [
        {
            email: "dinaspupr@lapormasalah.go.id",
            name: "Petugas Dinas PUPR",
            dinasType: DinasType.PUPR,
        },
        {
            email: "dinaspendidikan@lapormasalah.go.id",
            name: "Petugas Dinas Pendidikan",
            dinasType: DinasType.DIKNAS,
        },
        {
            email: "dinaskesehatan@lapormasalah.go.id",
            name: "Petugas Dinas Kesehatan",
            dinasType: DinasType.DINKES,
        },
        {
            email: "dinasesdm@lapormasalah.go.id",
            name: "Petugas Dinas ESDM",
            dinasType: DinasType.ESDM,
        },
    ];

    for (const user of dinasUsers) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                password: dinasPassword,
                name: user.name,
                role: UserRole.DINAS,
                dinasId: createdDinas[user.dinasType],
            },
        });
        console.log(`  ✓ ${user.email}`);
    }

    // Create Sample User (Warga)
    console.log("👤 Creating Sample User...");
    const sampleUser = await prisma.user.upsert({
        where: { email: "warga@example.com" },
        update: {},
        create: {
            email: "warga@example.com",
            password: userPassword,
            name: "Budi Santoso",
            phone: "08123456789",
            role: UserRole.USER,
        },
    });
    console.log("  ✓ warga@example.com");

    // Create Sample Reports
    console.log("📝 Creating Sample Reports...");

    const sampleReports = [
        // MENUNGGU_VERIFIKASI - untuk admin
        {
            category: ReportCategory.JALAN,
            description: "Jalan rusak parah dengan lubang besar sekitar 1 meter, membahayakan pengendara motor dan mobil. Sudah ada beberapa kejadian slip.",
            locationText: "Jl. Raya Sukamaju No. 45, Kelurahan Sukamaju, Kec. Cilandak",
            latitude: -6.2884,
            longitude: 106.7984,
            status: ReportStatus.MENUNGGU_VERIFIKASI,
        },
        {
            category: ReportCategory.JEMBATAN,
            description: "Jembatan penyeberangan rusak, pegangan sudah patah dan lantai kayu mulai keropos. Berbahaya untuk pejalan kaki.",
            locationText: "Jembatan Penyeberangan Pasar Minggu, Jl. Raya Pasar Minggu",
            latitude: -6.2831,
            longitude: 106.8421,
            status: ReportStatus.MENUNGGU_VERIFIKASI,
        },
        {
            category: ReportCategory.SEKOLAH,
            description: "Atap gedung sekolah bocor di beberapa titik, saat hujan air masuk ke ruang kelas dan mengganggu proses belajar mengajar.",
            locationText: "SDN 01 Kebayoran Baru, Jl. Senopati No. 10",
            latitude: -6.2431,
            longitude: 106.7983,
            status: ReportStatus.MENUNGGU_VERIFIKASI,
        },
        // DIDISPOSISIKAN - untuk dinas
        {
            category: ReportCategory.JALAN,
            description: "Jalan berlubang di area perumahan, sudah beberapa kali ditambal tapi rusak lagi. Perlu perbaikan permanen.",
            locationText: "Jl. Melati Raya, Perumahan Graha Indah, Depok",
            latitude: -6.3941,
            longitude: 106.8231,
            status: ReportStatus.DIDISPOSISIKAN,
            dinasType: DinasType.PUPR,
        },
        {
            category: ReportCategory.AIR,
            description: "Air PDAM mati sudah 3 hari, warga kesulitan untuk kebutuhan sehari-hari. Mohon segera diperbaiki.",
            locationText: "RT 05/RW 03, Kelurahan Jagakarsa, Jakarta Selatan",
            latitude: -6.3342,
            longitude: 106.8145,
            status: ReportStatus.DIDISPOSISIKAN,
            dinasType: DinasType.ESDM,
        },
        // DALAM_PENGERJAAN
        {
            category: ReportCategory.LISTRIK,
            description: "Tiang listrik miring hampir roboh, kabel listrik sudah menggantung rendah. Berbahaya terutama saat hujan.",
            locationText: "Jl. Bunga Raya No. 23, Kelurahan Cipete, Jakarta Selatan",
            latitude: -6.2743,
            longitude: 106.7932,
            status: ReportStatus.DALAM_PENGERJAAN,
            dinasType: DinasType.ESDM,
            budgetTotal: 15000000,
            budgetUsed: 5000000,
        },
        {
            category: ReportCategory.KESEHATAN,
            description: "Puskesmas membutuhkan renovasi ruang tunggu yang sudah tidak layak. Kursi rusak dan AC tidak berfungsi.",
            locationText: "Puskesmas Kecamatan Kebayoran Lama, Jl. Kebayoran Lama No. 12",
            latitude: -6.2453,
            longitude: 106.7812,
            status: ReportStatus.DALAM_PENGERJAAN,
            dinasType: DinasType.DINKES,
            budgetTotal: 25000000,
            budgetUsed: 10000000,
        },
        // SELESAI
        {
            category: ReportCategory.SEKOLAH,
            description: "Toilet sekolah rusak dan tidak bisa digunakan. Siswa terpaksa menggunakan fasilitas di luar sekolah.",
            locationText: "SMPN 5 Jakarta Selatan, Jl. Pulo Asem",
            latitude: -6.2634,
            longitude: 106.8543,
            status: ReportStatus.SELESAI,
            dinasType: DinasType.DIKNAS,
            budgetTotal: 20000000,
            budgetUsed: 18500000,
        },
        {
            category: ReportCategory.JALAN,
            description: "Jalan utama desa rusak berat setelah banjir. Akses ke desa terhambat.",
            locationText: "Jl. Desa Sukamulya, Kec. Cilandak",
            latitude: -6.2912,
            longitude: 106.7621,
            status: ReportStatus.SELESAI,
            dinasType: DinasType.PUPR,
            budgetTotal: 50000000,
            budgetUsed: 48000000,
        },
    ];

    for (const reportData of sampleReports) {
        const { dinasType, budgetTotal, budgetUsed, ...data } = reportData;

        const report = await prisma.report.create({
            data: {
                ...data,
                userId: sampleUser.id,
                dinasId: dinasType ? createdDinas[dinasType] : undefined,
                budgetTotal: budgetTotal || undefined,
                budgetUsed: budgetUsed || undefined,
                adminVerifiedAt: data.status !== ReportStatus.MENUNGGU_VERIFIKASI ? new Date() : undefined,
                adminVerifiedBy: data.status !== ReportStatus.MENUNGGU_VERIFIKASI ? admin.id : undefined,
                completedAt: data.status === ReportStatus.SELESAI ? new Date() : undefined,
                timeline: {
                    create: {
                        actorId: sampleUser.id,
                        eventType: "CREATED",
                        title: "Laporan Dibuat",
                        description: `Laporan berhasil dibuat oleh ${sampleUser.name}`,
                    },
                },
            },
        });
        console.log(`  ✓ Report: ${data.locationText.substring(0, 40)}...`);
    }

    console.log("✅ Seed completed!");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
