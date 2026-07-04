import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';

@Injectable()
export class EspecialidadesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.especialidad.findMany({
      include: { doctores: { include: { usuario: true } } },
    });
  }

  async findOne(id: string) {
    const esp = await this.prisma.especialidad.findUnique({
      where: { id },
      include: { doctores: { include: { usuario: true } } },
    });
    if (!esp) throw new NotFoundException('Especialidad no encontrada');
    return esp;
  }

  async create(dto: CreateEspecialidadDto) {
    return this.prisma.especialidad.create({ data: dto });
  }

  async update(id: string, dto: UpdateEspecialidadDto) {
    await this.findOne(id);
    return this.prisma.especialidad.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.especialidad.delete({ where: { id } });
  }
}