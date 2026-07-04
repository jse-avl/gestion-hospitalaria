import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

enum Rol {
  ADMIN = 'ADMIN', RECEPCIONISTA = 'RECEPCIONISTA',
  DOCTOR = 'DOCTOR', PACIENTE = 'PACIENTE',
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  nombre: string;

  @IsOptional()
  @IsEnum(Rol)
  rol?: Rol;

  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}