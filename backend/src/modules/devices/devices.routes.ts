import { Router } from 'express';
import { DevicesController } from './devices.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const controller = new DevicesController();

router.use(authenticate);

router.post('/register', controller.register);
router.post('/unregister', controller.unregister);

export const deviceRoutes = router;
