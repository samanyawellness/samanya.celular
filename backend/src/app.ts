import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { deviceRoutes } from './modules/devices/devices.routes.js';
import { residentesRoutes } from './modules/residentes/residentes.routes.js';
import { consentimientosRoutes } from './modules/consentimientos/consentimientos.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

export function createApp() {
  const app = express();

  // Middlewares de seguridad y parsing
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Healthcheck
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'UP',
      service: 'SAMANYA OS API Backend',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV
    });
  });

  // Montaje de rutas por dominio v1
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/devices', deviceRoutes);
  app.use('/api/v1/residentes', residentesRoutes);
  app.use('/api/v1/consentimientos', consentimientosRoutes);

  // Manejador centralizado de errores
  app.use(errorHandler);

  return app;
}
