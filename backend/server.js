/**
 * CI-001: server.js
 * Entry point for the TaskFlow Express backend.
 * Baseline: System Baseline v1.0.0
 */

import express from 'express';
import cors    from 'cors';
import dotenv  from 'dotenv';
import { initializeDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Mount routes
app.use('/api/auth',  authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', version: '1.0.0', ci: 'CI-001' })
);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Boot: initialise DB first (async), then start listening
initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅  TaskFlow API  →  http://localhost:${PORT}`);
    console.log(`    NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch((err) => {
  console.error('❌  Failed to initialise database:', err);
  process.exit(1);
});
