
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create Invoice
router.post('/', async (req, res) => {
    const { clientId, items, paymentMethod } = req.body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Get active sequence
            const sequence = await tx.fiscalSequence.findFirst({
                where: { isActive: true },
            });

            if (!sequence) throw new Error("No hay secuencia fiscal activa");

            // Check expiration and ranges using numbers
            if (sequence.currentNumber >= parseInt(sequence.endRange)) {
                throw new Error("Secuencia fiscal agotada");
            }

            // 2. Generate Invoice Number (CAI format)
            // Format: 000-000-01-00000000
            const nextNum = sequence.currentNumber + 1;
            const formattedNum = `${sequence.branchCode}-${sequence.emissionPoint}-${sequence.docType}-${String(nextNum).padStart(8, '0')}`;

            // 3. Calculate Totals (Server-side validation)
            let subtotal = 0;
            let taxAmount = 0;
            let total = 0;

            // We need to fetch products to get real prices and tax rates
            const productIds = items.map((i: any) => i.productId);
            const dbProducts = await tx.product.findMany({
                where: { id: { in: productIds } }
            });

            const invoiceItemsData = items.map((item: any) => {
                const product = dbProducts.find(p => p.id === item.productId);
                if (!product) throw new Error(`Producto ${item.productId} no encontrado`);

                // Check Stock
                if (product.stock < item.quantity) {
                    throw new Error(`Stock insuficiente para ${product.name}`);
                }

                const itemSubtotal = Number(product.price) * item.quantity;
                const itemTax = product.isExonerated ? 0 : (itemSubtotal * Number(product.taxRate));
                const itemTotal = itemSubtotal + itemTax;

                subtotal += itemSubtotal;
                taxAmount += itemTax;
                total += itemTotal;

                // Decrement Stock
                // Note: In an async transaction we should ideally use update with increment/decrement
                // but for simplicity here we rely on the strictly sequential execution within transaction scope usually
                // For higher concurrency, we'd do:
                // await tx.product.update({ where: { id: product.id }, data: { stock: { decrement: item.quantity } } })
            });

            // Execute stock updates
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            // 4. Create Invoice
            const invoice = await tx.invoice.create({
                data: {
                    invoiceNumber: formattedNum,
                    cai: sequence.cai,
                    sequenceId: sequence.id,
                    clientId,
                    subtotal,
                    taxAmount,
                    total,
                    status: 'ISSUED',
                    items: {
                        create: items.map((item: any) => {
                            const product = dbProducts.find(p => p.id === item.productId)!;
                            const itemSubtotal = Number(product.price) * item.quantity;
                            const itemTax = product.isExonerated ? 0 : (itemSubtotal * Number(product.taxRate));
                            return {
                                productId: item.productId,
                                quantity: item.quantity,
                                unitPrice: product.price,
                                subtotal: itemSubtotal,
                                tax: itemTax,
                                total: itemSubtotal + itemTax
                            };
                        })
                    }
                },
                include: {
                    items: {
                        include: { product: true }
                    },
                    client: true
                }
            });

            // 5. Update Sequence
            await tx.fiscalSequence.update({
                where: { id: sequence.id },
                data: { currentNumber: nextNum }
            });

            return invoice;
        });

        res.json(result);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || 'Error creating invoice' });
    }
});

export default router;
