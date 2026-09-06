import { Request, Response, NextFunction } from 'express';
import { NotificacionesService } from './notificaciones.service.js';

const notificacionesService = new NotificacionesService();

export class NotificacionesController {
  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id || 1;
      const data = await notificacionesService.listarNotificaciones(userId);
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}
