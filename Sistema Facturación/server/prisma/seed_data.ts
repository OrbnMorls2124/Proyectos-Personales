
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Quick seed for products and clients to test the invoice system
async function seedData() {
    console.log('Seeding products and clients...')

    // Clean up
    await prisma.invoiceItem.deleteMany({})
    await prisma.invoice.deleteMany({})
    await prisma.client.deleteMany({})
    await prisma.product.deleteMany({})

    // Clients
    const client = await prisma.client.create({
        data: {
            name: 'Consumidor Final',
            rtn: '99999999999999',
            address: 'Ciudad',
            email: 'consumidor@ejemplo.com'
        }
    })

    await prisma.client.create({
        data: {
            name: 'Distribuidora del Norte S. de R.L.',
            rtn: '05011990123456',
            address: 'San Pedro Sula, Cortés',
            email: 'contacto@distnorte.hn'
        }
    })

    // Products
    await prisma.product.createMany({
        data: [
            {
                code: 'REF-001',
                name: 'Refresco Cola 3L',
                price: 65.00,
                stock: 100,
                taxRate: 0.15
            },
            {
                code: 'ARR-002',
                name: 'Arroz Blanco 1lb',
                price: 18.00,
                stock: 500,
                isExonerated: true,
                taxRate: 0
            },
            {
                code: 'JAB-003',
                name: 'Jabón de Baño Pack x3',
                price: 95.50,
                stock: 45,
                taxRate: 0.15
            },
            {
                code: 'CER-004',
                name: 'Cerveza Importada 6pk',
                price: 240.00,
                stock: 200,
                taxRate: 0.18 // 15% + 18% alcohol tax? Usually 15 or 18 specific
            }
        ]
    })

    console.log('Seed data created successfully')
}

seedData()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
