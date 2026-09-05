import { Request, Response, NextFunction } from 'express';
import { DevicesService } from './devices.service.js';
import { registerDeviceSchema, unregisterDeviceSchema } from './devices.dto.js';

export class DevicesController {
  constructor(private devicesService = new DevicesService()) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = registerDeviceSchema.parse(req.body);
      const userId = req.user!.id;

      await this.devicesService.registerDevice(userId, validated);

      res.status(200).json({
        success: true,
        message: 'Dispositivo registrado para notificaciones push exitosamente',
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  };

  unregister = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = unregisterDeviceSchema.parse(req.body);
      const userId = req.user!.id;

      await this.devicesService.unregisterDevice(userId, validated);

      res.status(200).json({
        success: true,
        message: 'Token de dispositivo desactivado exitosamente',
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  };
}
