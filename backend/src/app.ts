import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { deviceRoutes } from './modules/devices/devices.routes.js';
import { residentesRoutes } from './modules/residentes/residentes.routes.js';
import { consentimientosRoutes } from './modules/consentimientos/consentimientos.routes.js';
import { tareasRoutes } from './modules/tareas/tareas.routes.js';
import { notificacionesRoutes } from './modules/notificaciones/notificaciones.routes.js';
import { archivosRoutes } from './modules/archivos/archivos.routes.js';
import { maestrasRoutes } from './modules/maestras/maestras.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

export function createApp() {
  const app = express();

  // Middlewares de seguridad y parsing
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );
  app.use(
    cors({
      origin: (origin, callback) => {
        // Permitir peticiones desde apps móviles (http://localhost, capacitor://localhost) y desarrollo
        callback(null, true);
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Logging de peticiones API para observabilidad y auditoría
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`📡 [${req.method}] ${req.url}`);
    }
    next();
  });

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
  app.use('/api/v1/tareas', tareasRoutes);
  app.use('/api/v1/notificaciones', notificacionesRoutes);
  app.use('/api/v1/archivos', archivosRoutes);
  app.use('/api/v1/maestras', maestrasRoutes);

  // Manejador centralizado de errores
  app.use(errorHandler);

  return app;
}
