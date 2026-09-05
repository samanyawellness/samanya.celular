import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const controller = new AuthController();

// Rutas públicas
router.post('/login', controller.login);
router.post('/refresh', controller.refreshToken);

// Rutas protegidas
router.get('/me', authenticate, controller.getMe);
router.post('/logout', authenticate, controller.logout);

export const authRoutes = router;
