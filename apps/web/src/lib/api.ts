const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

function getTokens() {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
}

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = getTokens();
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
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
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${path}`, { ...options, headers });
    }
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
    register: (data: { email: string; password: string; nombre: string; cedula?: string; telefono?: string }) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  },
  sucursales: {
    list: () => apiFetch('/sucursales'),
    get: (id: string) => apiFetch(`/sucursales/${id}`),
  },
  especialidades: {
    list: () => apiFetch('/especialidades'),
  },
  doctores: {
    disponibles: (params: { sucursalId?: string; especialidadId?: string; fecha?: string }) => {
      const qs = new URLSearchParams();
      if (params.sucursalId) qs.set('sucursalId', params.sucursalId);
      if (params.especialidadId) qs.set('especialidadId', params.especialidadId);
      if (params.fecha) qs.set('fecha', params.fecha);
      return apiFetch(`/doctores/disponibles?${qs}`);
    },
  },
  citas: {
    misCitas: () => apiFetch('/citas/mis-citas'),
    create: (data: any) => apiFetch('/citas', { method: 'POST', body: JSON.stringify(data) }),
    cancelar: (id: string) => apiFetch(`/citas/${id}/cancelar`, { method: 'PATCH', body: JSON.stringify({ motivo: 'Cancelado por el paciente' }) }),
  },
  pacientes: {
    getPerfil: (id: string) => apiFetch(`/pacientes/${id}`),
  },
};