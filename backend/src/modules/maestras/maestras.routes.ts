import { Router } from 'express';
import { MaestrasController } from './maestras.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const controller = new MaestrasController();

// Consulta de tablas maestras con autenticación y filtrado por organización
router.use(authenticate);

router.get('/catalogo', controller.getTablasDisponibles);
router.get('/:tabla', controller.getTabla);

export const maestrasRoutes = router;
