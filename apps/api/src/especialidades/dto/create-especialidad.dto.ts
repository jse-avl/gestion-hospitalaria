import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateEspecialidadDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  cupoMaximo?: number;
}