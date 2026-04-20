
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@facturacion.hn' },
        update: {},
        create: {
            email: 'admin@facturacion.hn',
            name: 'Administrador',
            password,
            role: 'ADMIN',
        },
    })

    console.log({ admin })

    // Create CAI Sequence
    const sequence = await prisma.fiscalSequence.create({
        data: {
            cai: '372E04-9F2844-434089-9A2276-857643-23',
            branchCode: '000',
            emissionPoint: '001',
            docType: '01',
            startRange: '00000001',
            endRange: '00002500',
            currentNumber: 0,
            expirationDate: new Date('2026-12-31'),
        }
    })

    console.log({ sequence })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
