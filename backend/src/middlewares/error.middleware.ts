import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(`❌ [${req.method}] ${req.originalUrl} - Error:`, err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      error: 'VALIDATION_ERROR',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message
      })),
      meta: { timestamp: new Date().toISOString() }
    });
    return;
  }

  // Manejo de errores específicos de Oracle (ORA-XXXXX)
  if (err && err.errorNum) {
    // Si es un error de aplicación lanzado por PL/SQL (ej. RAISE_APPLICATION_ERROR -20000 o -20001)
    if (err.errorNum >= 20000 && err.errorNum <= 20999) {
      res.status(400).json({
        success: false,
        message: err.message.replace(/^ORA-\d+:\s*/, ''),
        error: `ORA_${err.errorNum}`,
        meta: { timestamp: new Date().toISOString() }
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error en la base de datos',
      error: `ORA_${err.errorNum}`,
      meta: { timestamp: new Date().toISOString() }
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: err.name || 'INTERNAL_SERVER_ERROR',
    meta: { timestamp: new Date().toISOString() }
  });
}
