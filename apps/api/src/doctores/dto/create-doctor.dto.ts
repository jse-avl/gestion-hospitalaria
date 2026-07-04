import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  especialidadId: string;

  @IsString()
  sucursalId: string;

  @IsOptional()
  horario?: any;

  @IsOptional()
  @IsString()
  password?: string;
}