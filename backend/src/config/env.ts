import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('4000'),
  DB_USER: z.string().min(1, 'DB_USER es requerido'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD es requerido'),
  DB_CONNECT_STRING: z.string().min(1, 'DB_CONNECT_STRING es requerido'),
  DB_POOL_MIN: z.string().transform((val) => parseInt(val, 10)).default('2'),
  DB_POOL_MAX: z.string().transform((val) => parseInt(val, 10)).default('10'),
  DB_POOL_INCREMENT: z.string().transform((val) => parseInt(val, 10)).default('2'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET debe tener al menos 16 caracteres'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET debe tener al menos 16 caracteres'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('15d'),
  CORS_ORIGIN: z.string().default('*')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Error de validación en variables de entorno:', parsed.error.format());
  throw new Error('Configuración inválida en variables de entorno');
}

export const env = parsed.data;
