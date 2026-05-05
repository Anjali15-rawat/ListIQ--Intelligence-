import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/api.routes.js';

const app = express();

app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for easier integration with third-party APIs
}));

app.use(cors({
  origin: true, // In production, it is easier to allow 'true' which mirrors the request origin
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

app.use('/api', apiRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('🔥 [Global Error Handler]:', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;