import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('sucursales')
export class SucursalesController {
  constructor(private service: SucursalesService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateSucursalDto) { return this.service.create(dto); }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateSucursalDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}