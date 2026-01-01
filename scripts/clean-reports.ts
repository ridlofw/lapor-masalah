import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting to clean reports...')

    try {
        const deleteResult = await prisma.report.deleteMany({})
        console.log(`Successfully deleted ${deleteResult.count} reports.`)
    } catch (error) {
        console.error('Error cleaning reports:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
