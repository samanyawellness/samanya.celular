import { Router } from 'express';
import { ResidentesController } from './residentes.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const controller = new ResidentesController();

router.use(authenticate);

router.get('/', (req, res, next) => controller.listar(req, res, next));
router.get('/bitacora', (req, res, next) => controller.bitacora(req, res, next));
router.post('/bitacora', (req, res, next) => controller.registrarBitacora(req, res, next));
router.get('/signos-vitales', (req, res, next) => controller.signosVitales(req, res, next));
router.post('/signos-vitales', (req, res, next) => controller.registrarSignosVitales(req, res, next));
router.get('/:id', (req, res, next) => controller.detalle(req, res, next));
router.get('/:id/bitacora', (req, res, next) => controller.bitacora(req, res, next));
router.get('/:id/signos-vitales', (req, res, next) => controller.signosVitales(req, res, next));

export const residentesRoutes = router;
