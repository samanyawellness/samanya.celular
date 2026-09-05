import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { TokenPayload } from '../../types/auth.types.js';
import { AuthRepository } from './auth.repository.js';
import { LoginDto, RefreshTokenDto } from './auth.dto.js';

export class AuthService {
  constructor(private authRepo = new AuthRepository()) {}

  async login(dto: LoginDto, ip: string, userAgent: string) {
    const user = await this.authRepo.findByUsernameOrEmail(dto.usernameOrEmail);

    if (!user) {
      await this.authRepo.recordAccessLog(null, ip, userAgent, false, 'Usuario no encontrado');
      throw new Error('Credenciales inválidas');
    }

    // Verificar estado del usuario (ej. Activo)
    if (user.NOMBRE_ESTADO_USUARIO.toLowerCase() !== 'activo' && user.ID_ESTADO_USUARIO !== 1) {
      await this.authRepo.recordAccessLog(user.ID, ip, userAgent, false, 'Usuario inactivo');
      throw new Error('El usuario se encuentra inactivo. Comuníquese con administración.');
    }

    // Comparación de contraseña: soporta bcrypt o hash
    let passwordMatch = false;
    if (user.PASSWORD_HASH.startsWith('$2a$') || user.PASSWORD_HASH.startsWith('$2b$')) {
      passwordMatch = await bcrypt.compare(dto.password, user.PASSWORD_HASH);
    } else {
      // Comparación directa en caso de entornos de desarrollo/seed
      passwordMatch = user.PASSWORD_HASH === dto.password;
    }

    if (!passwordMatch) {
      await this.authRepo.recordAccessLog(user.ID, ip, userAgent, false, 'Contraseña incorrecta');
      throw new Error('Credenciales inválidas');
    }

    // Registrar acceso exitoso y actualizar último acceso
    await this.authRepo.recordAccessLog(user.ID, ip, userAgent, true, 'Autenticación exitosa');
    await this.authRepo.updateLastAccess(user.ID);

    const payload: TokenPayload = {
      id: user.ID,
      username: user.USERNAME,
      email: user.EMAIL,
      role: user.CODIGO_ROL,
      nombreCompleto: user.NOMBRE_COMPLETO
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any
    });

    const refreshToken = jwt.sign({ id: user.ID }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.ID,
        username: user.USERNAME,
        email: user.EMAIL,
        nombreCompleto: user.NOMBRE_COMPLETO,
        role: user.CODIGO_ROL,
        nombreRol: user.NOMBRE_ROL,
        telefono: user.TELEFONO,
        avatarUrl: user.AVATAR_URL
      }
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const decoded = jwt.verify(dto.refreshToken, env.JWT_REFRESH_SECRET) as { id: number };
      const user = await this.authRepo.findById(decoded.id);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const payload: TokenPayload = {
        id: user.ID,
        username: user.USERNAME,
        email: user.EMAIL,
        role: user.CODIGO_ROL,
        nombreCompleto: user.NOMBRE_COMPLETO
      };

      const accessToken = jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as any
      });

      return { accessToken };
    } catch (err: any) {
      throw new Error('Refresh token expirado o inválido');
    }
  }

  async getProfile(userId: number) {
    const user = await this.authRepo.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: user.ID,
      username: user.USERNAME,
      email: user.EMAIL,
      nombreCompleto: user.NOMBRE_COMPLETO,
      role: user.CODIGO_ROL,
      nombreRol: user.NOMBRE_ROL,
      telefono: user.TELEFONO,
      avatarUrl: user.AVATAR_URL
    };
  }
}
