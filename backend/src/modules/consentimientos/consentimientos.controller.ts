import { Request, Response, NextFunction } from 'express';
import { ConsentimientosService } from './consentimientos.service.js';

const consentimientosService = new ConsentimientosService();

export class ConsentimientosController {
  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idResidente = req.query.idResidente ? parseInt(req.query.idResidente as string, 10) : undefined;
      const data = await consentimientosService.listarConsentimientos(idResidente);
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async firmar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idConsentimiento = parseInt(req.params.id, 10);
      if (isNaN(idConsentimiento)) {
        res.status(400).json({ success: false, message: 'ID de consentimiento inválido' });
        return;
      }

      const userId = req.user?.id || 1;
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

      const result = await consentimientosService.registrarFirma(
        {
          idConsentimiento,
          ipFirma: clientIp,
          canvasBase64: req.body.canvasBase64,
          firmaDigitalHash: req.body.firmaDigitalHash
        },
        userId
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
