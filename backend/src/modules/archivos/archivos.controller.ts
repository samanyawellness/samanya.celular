import { Request, Response, NextFunction } from 'express';
import { archivosService } from './archivos.service.js';

export class ArchivosController {
  /**
   * Carga de archivo a Google Drive y registro en SMY_ARCHIVOS
   * POST /api/v1/archivos/upload
   */
  async subirArchivo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'Debe adjuntar un archivo para realizar la carga.'
        });
        return;
      }

      const { idCentro, idResidente, idClaseArchivo, tablaOrigen, idRegistroOrigen } = req.body;

      if (!idCentro || !idResidente) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros idCentro e idResidente son obligatorios.'
        });
        return;
      }

      const idUsuario = req.user?.id ? Number(req.user.id) : undefined;

      const resultado = await archivosService.subirArchivo({
        idCentro: Number(idCentro),
        idResidente: Number(idResidente),
        nombreOriginal: req.file.originalname,
        buffer: req.file.buffer,
        tipoMime: req.file.mimetype,
        idClaseArchivo: idClaseArchivo ? Number(idClaseArchivo) : 1,
        tablaOrigen: tablaOrigen ? String(tablaOrigen) : undefined,
        idRegistroOrigen: idRegistroOrigen ? Number(idRegistroOrigen) : undefined,
        idUsuario
      });

      res.status(201).json({
        success: true,
        message: 'Archivo cargado y registrado exitosamente en Google Drive y base de datos.',
        data: resultado,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Borrado lógico de archivo (ID_ESTADO_ARCHIVO = 2: no visible)
   * DELETE /api/v1/archivos/:id
   */
  async borrarArchivo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idArchivo = Number(req.params.id);
      const idUsuario = req.user?.id ? Number(req.user.id) : 1;
      const { motivo } = req.body;

      if (isNaN(idArchivo)) {
        res.status(400).json({
          success: false,
          message: 'El identificador del archivo no es válido.'
        });
        return;
      }

      const mensaje = await archivosService.borrarArchivoLogico(idArchivo, idUsuario, motivo);

      res.status(200).json({
        success: true,
        message: mensaje,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Renombrado lógico de archivo
   * PATCH /api/v1/archivos/:id/renombrar
   */
  async renombrarArchivo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idArchivo = Number(req.params.id);
      const { nuevoNombre } = req.body;
      const idUsuario = req.user?.id ? Number(req.user.id) : 1;

      if (isNaN(idArchivo) || !nuevoNombre || !String(nuevoNombre).trim()) {
        res.status(400).json({
          success: false,
          message: 'Debe especificar un ID válido y el nuevo nombre del archivo.'
        });
        return;
      }

      const mensaje = await archivosService.renombrarArchivo(idArchivo, String(nuevoNombre).trim(), idUsuario);

      res.status(200).json({
        success: true,
        message: mensaje,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Copiar / Clonar archivo
   * POST /api/v1/archivos/:id/copiar
   */
  async copiarArchivo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idArchivo = Number(req.params.id);
      const { nuevoIdResidente, nuevoIdCentro, nuevoNombre } = req.body;
      const idUsuario = req.user?.id ? Number(req.user.id) : 1;

      if (isNaN(idArchivo)) {
        res.status(400).json({
          success: false,
          message: 'El identificador del archivo no es válido.'
        });
        return;
      }

      const resultado = await archivosService.copiarArchivo({
        idArchivoOrigen: idArchivo,
        nuevoIdResidente: nuevoIdResidente ? Number(nuevoIdResidente) : undefined,
        nuevoIdCentro: nuevoIdCentro ? Number(nuevoIdCentro) : undefined,
        nuevoNombre: nuevoNombre ? String(nuevoNombre) : undefined,
        idUsuario
      });

      res.status(201).json({
        success: true,
        message: resultado.mensaje,
        data: { idNuevoArchivo: resultado.idNuevoArchivo },
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listar archivos de un residente
   * GET /api/v1/archivos/residente/:idResidente
   */
  async listarPorResidente(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idResidente = Number(req.params.idResidente);
      const soloVisibles = req.query.incluirNoVisibles !== 'true';

      if (isNaN(idResidente)) {
        res.status(400).json({
          success: false,
          message: 'El identificador del residente no es válido.'
        });
        return;
      }

      const archivos = await archivosService.listarArchivosResidente(idResidente, soloVisibles);

      res.status(200).json({
        success: true,
        count: archivos.length,
        data: archivos,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const archivosController = new ArchivosController();
