
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    const { q } = req.query;

    try {
        const products = await prisma.product.findMany({
            where: q ? {
                OR: [
                    { name: { contains: String(q) } },
                    { code: { contains: String(q) } }
                ]
            } : undefined,
            take: 20
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error searching products' });
    }
});

// Quick add product (for testing)
router.post('/', async (req, res) => {
    try {
        const product = await prisma.product.create({
            data: req.body
        });
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: 'Error creating product' });
    }
});

export default router;
