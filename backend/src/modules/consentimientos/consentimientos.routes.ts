import { Router } from 'express';
import { ConsentimientosController } from './consentimientos.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const controller = new ConsentimientosController();

router.use(authenticate);

router.get('/', (req, res, next) => controller.listar(req, res, next));
router.post('/:id/firmar', (req, res, next) => controller.firmar(req, res, next));

export const consentimientosRoutes = router;
