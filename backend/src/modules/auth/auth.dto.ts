import { z } from 'zod';

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(3, 'Usuario o email requerido'),
  password: z.string().min(1, 'Contraseña requerida')
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(10, 'Refresh token requerido')
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
