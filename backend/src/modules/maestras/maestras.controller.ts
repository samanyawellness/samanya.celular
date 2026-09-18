import { Request, Response, NextFunction } from 'express';
import { MaestrasService } from './maestras.service.js';

export class MaestrasController {
  constructor(private service = new MaestrasService()) {}

  getTabla = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tabla } = req.params;
      // Prioridad de resolución de idOrganizacion:
      // 1. Query parameter (?idOrganizacion=1)
      // 2. Encabezado 'x-organizacion-id' parseado en req.idOrganizacion
      // 3. Valor por defecto 1 si no se envía
      const idOrgParam = req.query.idOrganizacion ? Number(req.query.idOrganizacion) : undefined;
      const idOrganizacion = idOrgParam || req.idOrganizacion || 1;

      const data = await this.service.consultarTablaMaestra(tabla, idOrganizacion);

      res.status(200).json({
        success: true,
        data,
        meta: {
          tabla: tabla.toUpperCase(),
          idOrganizacion,
          total: data.length,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      next(err);
    }
  };

  getTablasDisponibles = async (req: Request, res: Response): Promise<void> => {
    const tablas = this.service.obtenerTablasPermitidas();
    res.status(200).json({
      success: true,
      data: tablas,
      meta: {
        total: tablas.length,
        timestamp: new Date().toISOString()
      }
    });
  };
}
