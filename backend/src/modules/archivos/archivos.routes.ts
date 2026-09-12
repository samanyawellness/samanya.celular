import { Router } from 'express';
import multer from 'multer';
import { archivosController } from './archivos.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB límite por archivo
  }
});

export const archivosRoutes = Router();

/**
 * @route   POST /api/v1/archivos/upload
 * @desc    Carga un archivo a Google Drive (jerarquía Sede/Residente/Documentos)
 *          y persiste sus metadatos con nombre hasheado en SMY_ARCHIVOS
 * @access  Privado (requiere autenticación Bearer)
 */
archivosRoutes.post(
  '/upload',
  authenticate,
  upload.single('file'),
  (req, res, next) => archivosController.subirArchivo(req, res, next)
);

/**
 * @route   DELETE /api/v1/archivos/:id
 * @desc    Borrado lógico de archivo (ID_ESTADO_ARCHIVO = 2 / No visible)
 * @access  Privado
 */
archivosRoutes.delete(
  '/:id',
  authenticate,
  (req, res, next) => archivosController.borrarArchivo(req, res, next)
);

/**
 * @route   PATCH /api/v1/archivos/:id/renombrar
 * @desc    Renombrar lógicamente el archivo (NOMBRE_ARCHIVO)
 * @access  Privado
 */
archivosRoutes.patch(
  '/:id/renombrar',
  authenticate,
  (req, res, next) => archivosController.renombrarArchivo(req, res, next)
);

/**
 * @route   POST /api/v1/archivos/:id/copiar
 * @desc    Copiar o clonar referencia de un archivo hacia otro residente/centro
 * @access  Privado
 */
archivosRoutes.post(
  '/:id/copiar',
  authenticate,
  (req, res, next) => archivosController.copiarArchivo(req, res, next)
);

/**
 * @route   GET /api/v1/archivos/residente/:idResidente
 * @desc    Listar archivos activos/visibles de un residente
 * @access  Privado
 */
archivosRoutes.get(
  '/residente/:idResidente',
  authenticate,
  (req, res, next) => archivosController.listarPorResidente(req, res, next)
);
