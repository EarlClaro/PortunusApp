import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';
import auditRoutes from './routes/audits.js';
import incidentRoutes from './routes/incidents.js';
import notificationRoutes from './routes/notifications.js';

import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();

// Security & basics
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const corsOrigin = process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'];
app.use(cors({ origin: corsOrigin, credentials: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
app.use(limiter);

// Routes
app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/notifications', notificationRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Portunus API running on http://localhost:${PORT}`);
});
