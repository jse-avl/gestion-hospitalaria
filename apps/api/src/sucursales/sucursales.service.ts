import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@Injectable()
export class SucursalesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sucursal.findMany({
      include: {
        sucursalEspecialidades: {
          include: { especialidad: true },
        },
        doctores: {
          include: { usuario: true, especialidad: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const sucursal = await this.prisma.sucursal.findUnique({
      where: { id },
      include: {
        sucursalEspecialidades: {
          include: { especialidad: true },
        },
        doctores: {
          include: { usuario: true, especialidad: true },
        },
      },
    });
    if (!sucursal) throw new NotFoundException('Sucursal no encontrada');
    return sucursal;
  }

  async create(dto: CreateSucursalDto) {
    return this.prisma.sucursal.create({ data: dto });
  }

  async update(id: string, dto: UpdateSucursalDto) {
    await this.findOne(id);
    return this.prisma.sucursal.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.sucursal.delete({ where: { id } });
  }
}