import { Router } from 'express';
import { ResidentesController } from './residentes.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const controller = new ResidentesController();

router.use(authenticate);

router.get('/', (req, res, next) => controller.listar(req, res, next));
router.get('/:id', (req, res, next) => controller.detalle(req, res, next));
router.get('/:id/bitacora', (req, res, next) => controller.bitacora(req, res, next));

export const residentesRoutes = router;
