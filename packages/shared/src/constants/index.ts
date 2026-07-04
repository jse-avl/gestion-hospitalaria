export const ROLES = {
  ADMIN: 'ADMIN',
  RECEPCIONISTA: 'RECEPCIONISTA',
  DOCTOR: 'DOCTOR',
  PACIENTE: 'PACIENTE',
} as const;

export const ESTADOS_CITA = {
  PENDIENTE: 'PENDIENTE',
  CONFIRMADA: 'CONFIRMADA',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA',
  REASIGNADA: 'REASIGNADA',
} as const;

export const ORIGENES_CITA = {
  WEB: 'WEB',
  APP: 'APP',
  RECEPCIONISTA: 'RECEPCIONISTA',
  KIOSCO: 'KIOSCO',
  SMS: 'SMS',
} as const;

export const RATE_LIMITS = {
  LOGIN: { limit: 5, ttl: 60 },
  API: { limit: 100, ttl: 60 },
  CREAR_CITA: { limit: 20, ttl: 60 },
  BUSQUEDA: { limit: 60, ttl: 60 },
  PASSWORD_RESET: { limit: 3, ttl: 3600 },
} as const;
