import { Router } from 'express';
import { TareasController } from './tareas.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const controller = new TareasController();

router.use(authenticate);

router.get('/', (req, res, next) => controller.listar(req, res, next));
router.put('/:id/completar', (req, res, next) => controller.completar(req, res, next));

export const tareasRoutes = router;
