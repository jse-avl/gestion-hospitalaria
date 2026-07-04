export enum Rol {
  ADMIN = 'ADMIN',
  RECEPCIONISTA = 'RECEPCIONISTA',
  DOCTOR = 'DOCTOR',
  PACIENTE = 'PACIENTE',
}

export enum EstadoCita {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
  REASIGNADA = 'REASIGNADA',
}

export enum OrigenCita {
  WEB = 'WEB',
  APP = 'APP',
  RECEPCIONISTA = 'RECEPCIONISTA',
  KIOSCO = 'KIOSCO',
  SMS = 'SMS',
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  nombre: string;
  rol?: Rol;
  cedula?: string;
  telefono?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  usuario: UsuarioDto;
}

export interface UsuarioDto {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  activo: boolean;
  mfaActivo: boolean;
}

export interface SucursalDto {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string | null;
  horario: any;
  latitud: number | null;
  longitud: number | null;
  activa: boolean;
}

export interface CreateSucursalDto {
  nombre: string;
  direccion: string;
  telefono?: string;
  horario?: any;
  latitud?: number;
  longitud?: number;
}

export interface EspecialidadDto {
  id: string;
  nombre: string;
  descripcion: string | null;
  cupoMaximo: number;
  activa: boolean;
}

export interface DoctorDto {
  id: string;
  usuarioId: string;
  nombre: string;
  email: string;
  especialidadId: string;
  especialidadNombre: string;
  sucursalId: string;
  sucursalNombre: string;
  horario: any | null;
  activo: boolean;
}

export interface PacienteDto {
  id: string;
  usuarioId: string;
  nombre: string;
  email: string;
  cedula: string;
  telefono: string | null;
  fechaNacimiento: string | null;
  alergias: string | null;
  condiciones: string | null;
}

export interface CreateCitaDto {
  pacienteId: string;
  doctorId: string;
  sucursalId: string;
  especialidadId: string;
  fechaHora: string;
  notas?: string;
  origen?: OrigenCita;
}

export interface CitaDto {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  pacienteCedula: string;
  doctorId: string;
  doctorNombre: string;
  sucursalId: string;
  sucursalNombre: string;
  especialidadId: string;
  especialidadNombre: string;
  fechaHora: string;
  estado: EstadoCita;
  origen: OrigenCita;
  notas: string | null;
  checkinAt: string | null;
  createdAt: string;
}
