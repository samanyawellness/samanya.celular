/**
 * Cliente API REST para SAMANYA OS Web
 * Conecta el frontend React con la API intermedia Node/Express y Oracle DB
 */

import { Capacitor } from '@capacitor/core';

/**
 * Resolución dinámica de la URL base de la API:
 * - En navegador web local: utiliza el proxy relativo '/api/v1'
 * - En dispositivo móvil nativo (Android APK): apunta a la IP local del servidor backend (o variable de entorno)
 */
const DEFAULT_NATIVE_API = 'http://192.168.1.16:4000/api/v1';

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('samanya_custom_api_url');
    if (customUrl) return customUrl.replace(/\/+$/, '');
  }
  if ((import.meta as any).env?.VITE_API_BASE_URL) {
    return ((import.meta as any).env.VITE_API_BASE_URL as string).replace(/\/+$/, '');
  }
  // Detección robusta de entorno nativo (Capacitor Android / iOS)
  const isCapacitorNative =
    (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.()) ||
    Capacitor.isNativePlatform() ||
    Capacitor.getPlatform() !== 'web' ||
    (typeof window !== 'undefined' &&
      (window.location.protocol === 'capacitor:' ||
        (window.location.hostname === 'localhost' && window.location.port !== '3000')));

  if (isCapacitorNative) {
    return DEFAULT_NATIVE_API;
  }
  return '/api/v1';
}

export async function testApiHealth(targetUrl?: string): Promise<{ ok: boolean; message: string }> {
  try {
    const base = targetUrl ? targetUrl.replace(/\/+$/, '') : getApiBaseUrl();
    const healthUrl = base.replace(/\/api\/v1\/?$/, '/api/health');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(healthUrl, { method: 'GET', signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      return { ok: true, message: 'Conexión con el servidor backend exitosa.' };
    }
    return { ok: false, message: `El servidor respondió con código ${res.status}` };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.name === 'AbortError'
        ? 'Tiempo de espera agotado (5s). El servidor no respondió.'
        : `Error de red: ${err?.message || 'Failed to fetch'}. Verifique la IP y que el Firewall de Windows permita el puerto 4000.`
    };
  }
}

function getAuthToken(): string | null {
  return localStorage.getItem('samanya_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('samanya_token', token);
}

export function setActiveCentroContext(centroId?: number | string | null, orgId?: number | string | null) {
  if (centroId !== undefined && centroId !== null) {
    localStorage.setItem('samanya_active_centro_id', String(centroId));
  } else {
    localStorage.removeItem('samanya_active_centro_id');
  }
  if (orgId !== undefined && orgId !== null) {
    localStorage.setItem('samanya_active_org_id', String(orgId));
  } else {
    localStorage.removeItem('samanya_active_org_id');
  }
}

export function getActiveCentroContext() {
  return {
    centroId: localStorage.getItem('samanya_active_centro_id'),
    organizacionId: localStorage.getItem('samanya_active_org_id'),
  };
}

export function removeAuthToken() {
  localStorage.removeItem('samanya_token');
  localStorage.removeItem('samanya_active_centro_id');
  localStorage.removeItem('samanya_active_org_id');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const { centroId, organizacionId } = getActiveCentroContext();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (centroId) {
    headers['x-centro-id'] = centroId;
  }
  if (organizacionId) {
    headers['x-organizacion-id'] = organizacionId;
  }

  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}${endpoint}`, {
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
        centros?: Array<{
          idCentro: number | string;
          codigoCentro: string;
          nombreCentro: string;
          ciudad: string;
          direccion?: string;
          idOrganizacion: number | string;
          codigoOrganizacion: string;
          nombreOrganizacion: string;
          idRol?: number;
          codigoRol?: string;
          nombreRol?: string;
          esSedePrincipal?: boolean;
        }>;
        activeCentro?: any;
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

  // Tablas Maestras por Organización
  async getMasterTable(tableName: string, organizacionId?: number | string) {
    const org = organizacionId || localStorage.getItem('samanya_active_org_id') || '1';
    const res = await request<{ success: boolean; data: any[]; meta: any }>(
      `/maestras/${encodeURIComponent(tableName)}?idOrganizacion=${encodeURIComponent(org)}`
    );
    return res.data;
  },

  async getMasterCatalog() {
    const res = await request<{ success: boolean; data: string[] }>('/maestras/catalogo');
    return res.data;
  },

  async getMe() {
    return request<{ success: boolean; data: any }>('/auth/me');
  },

  // Residentes
  async getResidents(idCentro?: number | string) {
    const cid = idCentro ?? getActiveCentroContext().centroId;
    const url = cid ? `/residentes?idCentro=${encodeURIComponent(String(cid))}` : '/residentes';
    const res = await request<{ success: boolean; data: any[] }>(url);
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

  // Gestión de Archivos y Google Drive (SMY_ARCHIVOS)
  async uploadArchivo(data: {
    file: File;
    idCentro?: number | string;
    idResidente: number | string;
    idClaseArchivo?: number;
    tablaOrigen?: string;
    idRegistroOrigen?: number;
  }) {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('idCentro', String(data.idCentro || 1));
    formData.append('idResidente', String(data.idResidente));
    if (data.idClaseArchivo) {
      formData.append('idClaseArchivo', String(data.idClaseArchivo));
    }
    if (data.tablaOrigen) {
      formData.append('tablaOrigen', data.tablaOrigen);
    }
    if (data.idRegistroOrigen) {
      formData.append('idRegistroOrigen', String(data.idRegistroOrigen));
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${getApiBaseUrl()}/archivos/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      let errorMsg = `Error al subir archivo (${response.status}): ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson.message) {
          errorMsg = errorJson.message;
        }
      } catch (_) {}
      throw new Error(errorMsg);
    }

    return response.json();
  },

  async getArchivosResidente(idResidente: number | string) {
    const res = await request<{ success: boolean; data: any[] }>(`/archivos/residente/${idResidente}`);
    return res.data;
  },

  getArchivoVerUrl(idArchivo: number | string) {
    const token = getAuthToken();
    return `${getApiBaseUrl()}/archivos/${idArchivo}/ver${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  },

  getArchivoDescargarUrl(idArchivo: number | string) {
    const token = getAuthToken();
    return `${getApiBaseUrl()}/archivos/${idArchivo}/descargar${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  },

  async deleteArchivo(idArchivo: number | string, motivo?: string) {
    return request<{ success: boolean; message: string }>(`/archivos/${idArchivo}`, {
      method: 'DELETE',
      body: JSON.stringify({ motivo: motivo || 'Eliminado desde la interfaz de usuario' })
    });
  },
};
