export type UserRole = 'ADMIN' | 'CUIDADOR' | 'FAMILIAR';

export interface TokenPayload {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  nombreCompleto: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    timestamp: string;
    [key: string]: any;
  };
}
