import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CreatePacienteDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  cedula: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  alergias?: string;

  @IsOptional()
  @IsString()
  condiciones?: string;
}