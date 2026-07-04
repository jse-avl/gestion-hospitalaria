import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctoresService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.doctor.findMany({
      include: { usuario: true, especialidad: true, sucursal: true },
    });
  }

  async findOne(id: string) {
    const doc = await this.prisma.doctor.findUnique({
      where: { id },
      include: { usuario: true, especialidad: true, sucursal: true, citas: true },
    });
    if (!doc) throw new NotFoundException('Doctor no encontrado');
    return doc;
  }

  async findDisponibles(sucursalId?: string, especialidadId?: string, fecha?: string) {
    const where: any = { activo: true };
    if (sucursalId) where.sucursalId = sucursalId;
    if (especialidadId) where.especialidadId = especialidadId;

    const doctores = await this.prisma.doctor.findMany({
      where,
      include: { usuario: true, especialidad: true, sucursal: true },
    });

    if (!fecha) return doctores;

    const startOfDay = new Date(fecha);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(fecha);
    endOfDay.setHours(23, 59, 59, 999);

    const doctoresConCitas = await Promise.all(
      doctores.map(async (doc) => {
        const citas = await this.prisma.cita.findMany({
          where: {
            doctorId: doc.id,
            fechaHora: { gte: startOfDay, lte: endOfDay },
            estado: { not: 'CANCELADA' },
          },
          select: { fechaHora: true },
        });
        return { ...doc, citasDelDia: citas };
      }),
    );

    return doctoresConCitas;
  }

  async create(dto: CreateDoctorDto) {
    const passwordHash = await bcrypt.hash(dto.password || '123456', 12);
    const usuario = await this.prisma.usuario.create({
      data: { email: dto.email, passwordHash, nombre: dto.nombre, rol: 'DOCTOR' },
    });
    return this.prisma.doctor.create({
      data: {
        usuarioId: usuario.id,
        especialidadId: dto.especialidadId,
        sucursalId: dto.sucursalId,
        horario: dto.horario,
      },
      include: { usuario: true, especialidad: true, sucursal: true },
    });
  }

  async update(id: string, dto: UpdateDoctorDto) {
    await this.findOne(id);
    return this.prisma.doctor.update({
      where: { id },
      data: {
        especialidadId: dto.especialidadId,
        sucursalId: dto.sucursalId,
        horario: dto.horario,
      },
      include: { usuario: true, especialidad: true, sucursal: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.doctor.delete({ where: { id } });
  }
}