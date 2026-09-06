import { Request, Response, NextFunction } from 'express';
import { TareasService } from './tareas.service.js';

const tareasService = new TareasService();

export class TareasController {
  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await tareasService.listarTareas();
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async completar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idTarea = parseInt(req.params.id, 10);
      if (isNaN(idTarea)) {
        res.status(400).json({ success: false, message: 'ID de tarea inválido' });
        return;
      }

      const userId = req.user?.id || 1;
      const result = await tareasService.completarTarea(idTarea, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
