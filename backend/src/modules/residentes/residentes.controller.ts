import { Request, Response, NextFunction } from 'express';
import { ResidentesService } from './residentes.service.js';

const residentesService = new ResidentesService();

export class ResidentesController {
  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id || 1;
      const role = req.user?.role || 'CUIDADOR';
      const idCentroParam = req.query.idCentro ? Number(req.query.idCentro) : undefined;
      const idCentro = idCentroParam || req.idCentro;
      const data = await residentesService.listarResidentes(userId, role, idCentro);
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async detalle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idResidente = parseInt(req.params.id, 10);
      if (isNaN(idResidente)) {
        res.status(400).json({ success: false, message: 'ID de residente inválido' });
        return;
      }

      const data = await residentesService.obtenerDetalle(idResidente);
      if (!data) {
        res.status(404).json({ success: false, message: 'Residente no encontrado' });
        return;
      }

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async bitacora(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idResidente = req.params.id ? parseInt(req.params.id, 10) : undefined;
      const data = await residentesService.obtenerBitacora(idResidente && !isNaN(idResidente) ? idResidente : undefined);
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async registrarBitacora(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id || 1;
      const result = await residentesService.registrarBitacora(req.body, userId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async signosVitales(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idResidente = req.params.id ? parseInt(req.params.id, 10) : undefined;
      const data = await residentesService.obtenerSignosVitales(idResidente && !isNaN(idResidente) ? idResidente : undefined);
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async registrarSignosVitales(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id || 1;
      const result = await residentesService.registrarSignosVitales(req.body, userId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
