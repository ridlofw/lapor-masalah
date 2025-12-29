import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🗑️  Starting report deletion...");

    try {
        // Due to Cascade Delete in schema, deleting reports will automatically delete:
        // - ReportImages
        // - ReportTimelines
        // - ReportProgress (and subsequently ProgressImages)
        // - Supports
        const { count } = await prisma.report.deleteMany({});

        console.log(`✅ Successfully deleted ${count} reports and all related data.`);
    } catch (error) {
        console.error("❌ Error deleting reports:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
