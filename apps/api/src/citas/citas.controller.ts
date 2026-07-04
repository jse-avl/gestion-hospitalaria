import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('citas')
export class CitasController {
  constructor(private service: CitasService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'RECEPCIONISTA')
  findAll() { return this.service.findAll(); }

  @Get('mis-citas')
  @UseGuards(JwtAuthGuard)
  @Roles('PACIENTE')
  misCitas(@CurrentUser() user: any) { return this.service.misCitas(user.id); }

  @Get('del-dia')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'RECEPCIONISTA', 'DOCTOR')
  citasDelDia(
    @Query('sucursalId') sucursalId?: string,
    @Query('doctorId') doctorId?: string,
  ) { return this.service.citasDelDia(sucursalId, doctorId); }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateCitaDto, @Req() req: any) { return this.service.create(dto, req.user?.id); }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'RECEPCIONISTA')
  update(@Param('id') id: string, @Body() dto: UpdateCitaDto) { return this.service.update(id, dto); }

  @Patch(':id/cancelar')
  @UseGuards(JwtAuthGuard)
  cancelar(@Param('id') id: string, @Body('motivo') motivo?: string) { return this.service.cancelar(id, motivo); }

  @Patch(':id/checkin')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'RECEPCIONISTA')
  checkin(@Param('id') id: string) { return this.service.checkin(id); }

  @Patch(':id/completar')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'RECEPCIONISTA', 'DOCTOR')
  completar(@Param('id') id: string) { return this.service.completar(id); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}