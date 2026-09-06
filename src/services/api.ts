/**
 * Cliente API REST para SAMANYA OS Web
 * Conecta el frontend React con la API intermedia Node/Express y Oracle DB
 */

const API_BASE = '/api/v1';

function getAuthToken(): string | null {
  return localStorage.getItem('samanya_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('samanya_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('samanya_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) {
        errorMsg = errorJson.message;
      }
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Autenticación
  async login(usernameOrEmail: string, password: string) {
    const res = await request<{
      success: boolean;
      data: {
        accessToken: string;
        refreshToken: string;
        user: {
          id: number;
          username: string;
          email: string;
          nombreCompleto: string;
          role: 'ADMIN' | 'CUIDADOR' | 'FAMILIAR';
          nombreRol: string;
          telefono?: string;
          avatarUrl?: string;
        };
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password }),
    });

    if (res.data?.accessToken) {
      setAuthToken(res.data.accessToken);
    }
    return res.data;
  },

  async getMe() {
    return request<{ success: boolean; data: any }>('/auth/me');
  },

  // Residentes
  async getResidents() {
    const res = await request<{ success: boolean; data: any[] }>('/residentes');
    return res.data;
  },

  async getResidentDetail(id: number | string) {
    const res = await request<{ success: boolean; data: any }>(`/residentes/${id}`);
    return res.data;
  },

  // Tareas Operativas
  async getTasks() {
    const res = await request<{ success: boolean; data: any[] }>('/tareas');
    return res.data;
  },

  async completeTask(id: number | string) {
    return request(`/tareas/${id}/completar`, {
      method: 'PUT',
    });
  },

  // Bitácora Asistencial
  async getBitacora(residentId?: number | string) {
    const query = residentId ? `?idResidente=${residentId}` : '';
    const res = await request<{ success: boolean; data: any[] }>(`/residentes/bitacora${query}`);
    return res.data;
  },

  async addBitacoraEntry(data: {
    residentId: number;
    contenido: string;
    grabadoPorVoz?: boolean;
    audioUrl?: string;
    fotoAdjuntaUrl?: string;
  }) {
    return request('/residentes/bitacora', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Signos Vitales
  async getVitalSigns(residentId?: number | string) {
    const query = residentId ? `?idResidente=${residentId}` : '';
    const res = await request<{ success: boolean; data: any[] }>(`/residentes/signos-vitales${query}`);
    return res.data;
  },

  async addVitalSigns(data: {
    residentId: number;
    bloodPressure?: string;
    systolic?: number;
    diastolic?: number;
    heartRate: number;
    temperature: number;
    oxygenSaturation: number;
    glucose?: number;
    weight?: number;
    notes?: string;
  }) {
    return request('/residentes/signos-vitales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Consentimientos Informados
  async getConsents(residentId?: number | string) {
    const query = residentId ? `?idResidente=${residentId}` : '';
    const res = await request<{ success: boolean; data: any[] }>(`/consentimientos${query}`);
    return res.data;
  },

  async signConsent(id: number | string, data: { canvasBase64?: string; firmaDigitalHash?: string }) {
    return request(`/consentimientos/${id}/firmar`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Notificaciones
  async getNotifications() {
    const res = await request<{ success: boolean; data: any[] }>('/notificaciones');
    return res.data;
  },
};
