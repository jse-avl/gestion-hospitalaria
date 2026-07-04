import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('pacientes')
export class PacientesController {
  constructor(private service: PacientesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'RECEPCIONISTA')
  findAll() { return this.service.findAll(); }

  @Get('buscar')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'RECEPCIONISTA')
  buscarPorCedula(@Query('cedula') cedula: string) { return this.service.buscarPorCedula(cedula); }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'RECEPCIONISTA', 'DOCTOR')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'RECEPCIONISTA')
  create(@Body() dto: CreatePacienteDto) { return this.service.create(dto); }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'RECEPCIONISTA')
  update(@Param('id') id: string, @Body() dto: UpdatePacienteDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}