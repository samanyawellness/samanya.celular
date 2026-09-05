import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { loginSchema, refreshTokenSchema } from './auth.dto.js';

export class AuthController {
  constructor(private authService = new AuthService()) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = loginSchema.parse(req.body);
      const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'App Móvil';

      const result = await this.authService.login(validated, ip, userAgent);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Sesión iniciada correctamente',
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = refreshTokenSchema.parse(req.body);
      const result = await this.authService.refreshToken(validated);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Token renovado exitosamente',
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const profile = await this.authService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: profile,
        message: 'Perfil de usuario obtenido',
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response) => {
    // Al hacer logout, el cliente descarta tokens y se da de baja el token push
    res.status(200).json({
      success: true,
      message: 'Sesión cerrada correctamente',
      meta: { timestamp: new Date().toISOString() }
    });
  };
}
