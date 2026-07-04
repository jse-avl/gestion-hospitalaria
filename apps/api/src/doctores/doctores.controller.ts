import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DoctoresService } from './doctores.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('doctores')
export class DoctoresController {
  constructor(private service: DoctoresService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get('disponibles')
  findDisponibles(
    @Query('sucursalId') sucursalId?: string,
    @Query('especialidadId') especialidadId?: string,
    @Query('fecha') fecha?: string,
  ) { return this.service.findDisponibles(sucursalId, especialidadId, fecha); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateDoctorDto) { return this.service.create(dto); }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateDoctorDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}