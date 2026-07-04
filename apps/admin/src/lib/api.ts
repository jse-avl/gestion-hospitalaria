const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

function getTokens() {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };
  return { accessToken: localStorage.getItem('accessToken'), refreshToken: localStorage.getItem('refreshToken') };
}

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = getTokens();
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken;
  } catch { return null; }
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const { accessToken } = getTokens();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers as Record<string, string> };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  let res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (res.status === 401 && accessToken) {
    const newToken = await refreshAccessToken();
    if (newToken) { headers['Authorization'] = `Bearer ${newToken}`; res = await fetch(`${API_URL}${path}`, { ...options, headers }); }
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Error de conexión' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export const api = {
  auth: {
    login: (data: { email: string; password: string }) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  },
  sucursales: {
    list: () => apiFetch('/sucursales'),
    get: (id: string) => apiFetch(`/sucursales/${id}`),
    create: (data: any) => apiFetch('/sucursales', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch(`/sucursales/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/sucursales/${id}`, { method: 'DELETE' }),
  },
  especialidades: {
    list: () => apiFetch('/especialidades'),
    get: (id: string) => apiFetch(`/especialidades/${id}`),
    create: (data: any) => apiFetch('/especialidades', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch(`/especialidades/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/especialidades/${id}`, { method: 'DELETE' }),
  },
  doctores: {
    list: () => apiFetch('/doctores'),
    get: (id: string) => apiFetch(`/doctores/${id}`),
    create: (data: any) => apiFetch('/doctores', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch(`/doctores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/doctores/${id}`, { method: 'DELETE' }),
  },
  pacientes: {
    list: () => apiFetch('/pacientes'),
    buscar: (cedula: string) => apiFetch(`/pacientes/buscar?cedula=${cedula}`),
    get: (id: string) => apiFetch(`/pacientes/${id}`),
    create: (data: any) => apiFetch('/pacientes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch(`/pacientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  auditLogs: {
    list: (params?: { page?: number; limit?: number; entidad?: string }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.entidad) qs.set('entidad', params.entidad);
      return apiFetch(`/audit-logs${qs.toString() ? `?${qs}` : ''}`);
    },
  },
  citas: {
    list: () => apiFetch('/citas'),
    get: (id: string) => apiFetch(`/citas/${id}`),
    delDia: (sucursalId?: string) => apiFetch(`/citas/del-dia${sucursalId ? `?sucursalId=${sucursalId}` : ''}`),
    create: (data: any) => apiFetch('/citas', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch(`/citas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    cancelar: (id: string) => apiFetch(`/citas/${id}/cancelar`, { method: 'PATCH', body: JSON.stringify({}) }),
    checkin: (id: string) => apiFetch(`/citas/${id}/checkin`, { method: 'PATCH' }),
    completar: (id: string) => apiFetch(`/citas/${id}/completar`, { method: 'PATCH' }),
  },
};