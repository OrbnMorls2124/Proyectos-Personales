
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import clientRoutes from './routes/clients.routes';
import productRoutes from './routes/products.routes';
import invoiceRoutes from './routes/invoices.routes';

app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Sistema de Facturación Honduras API running' });
});

// Basic error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { app, prisma };
