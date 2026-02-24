
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get clients with search
router.get('/', async (req, res) => {
    const { q } = req.query;

    try {
        const clients = await prisma.client.findMany({
            where: q ? {
                OR: [
                    { name: { contains: String(q) } },
                    { rtn: { contains: String(q) } }
                ]
            } : undefined,
            take: 10
        });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Error searching clients' });
    }
});

// Create client
router.post('/', async (req, res) => {
    try {
        const client = await prisma.client.create({
            data: req.body
        });
        res.json(client);
    } catch (error) {
        res.status(400).json({ error: 'Error creating client' });
    }
});

export default router;
