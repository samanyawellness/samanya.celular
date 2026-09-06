import { Router } from 'express';
import { NotificacionesController } from './notificaciones.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const controller = new NotificacionesController();

router.use(authenticate);

router.get('/', (req, res, next) => controller.listar(req, res, next));

export const notificacionesRoutes = router;
