import { z } from 'zod';

export const registerDeviceSchema = z.object({
  tokenDispositivo: z.string().min(10, 'Token de dispositivo requerido'),
  plataforma: z.enum(['ANDROID', 'IOS', 'WEB'], {
    errorMap: () => ({ message: "Plataforma debe ser 'ANDROID', 'IOS' o 'WEB'" })
  })
});

export const unregisterDeviceSchema = z.object({
  tokenDispositivo: z.string().min(10, 'Token de dispositivo requerido')
});

export type RegisterDeviceDto = z.infer<typeof registerDeviceSchema>;
export type UnregisterDeviceDto = z.infer<typeof unregisterDeviceSchema>;
