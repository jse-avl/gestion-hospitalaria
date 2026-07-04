import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

enum OrigenCita {
  WEB = 'WEB', APP = 'APP', RECEPCIONISTA = 'RECEPCIONISTA',
}

export class CreateCitaDto {
  @IsString()
  pacienteId: string;

  @IsString()
  doctorId: string;

  @IsString()
  sucursalId: string;

  @IsString()
  especialidadId: string;

  @IsDateString()
  fechaHora: string;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsEnum(OrigenCita)
  origen?: OrigenCita;
}