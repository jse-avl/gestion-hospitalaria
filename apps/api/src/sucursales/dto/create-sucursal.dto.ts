import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateSucursalDto {
  @IsString()
  nombre: string;

  @IsString()
  direccion: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  horario?: any;

  @IsOptional()
  @IsNumber()
  latitud?: number;

  @IsOptional()
  @IsNumber()
  longitud?: number;
}