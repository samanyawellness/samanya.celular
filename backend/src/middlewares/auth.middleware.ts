import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { TokenPayload, UserRole } from '../types/auth.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Token de autorización ausente o con formato inválido',
      meta: { timestamp: new Date().toISOString() }
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'El token de autorización ha expirado',
        error: 'TOKEN_EXPIRED',
        meta: { timestamp: new Date().toISOString() }
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Token de autorización inválido',
      error: 'INVALID_TOKEN',
      meta: { timestamp: new Date().toISOString() }
    });
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        meta: { timestamp: new Date().toISOString() }
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Acceso restringido. Se requiere uno de los roles: [${allowedRoles.join(', ')}]`,
        error: 'FORBIDDEN_ROLE',
        meta: { timestamp: new Date().toISOString() }
      });
      return;
    }

    next();
  };
}
