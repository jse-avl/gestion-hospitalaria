import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Injectable()
export class CitasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cita.findMany({
      include: {
        paciente: { include: { usuario: true } },
        doctor: { include: { usuario: true } },
        sucursal: true,
        especialidad: true,
      },
      orderBy: { fechaHora: 'desc' },
    });
  }

  async findOne(id: string) {
    const cita = await this.prisma.cita.findUnique({
      where: { id },
      include: {
        paciente: { include: { usuario: true } },
        doctor: { include: { usuario: true } },
        sucursal: true,
        especialidad: true,
      },
    });
    if (!cita) throw new NotFoundException('Cita no encontrada');
    return cita;
  }

  async misCitas(pacienteId: string) {
    return this.prisma.cita.findMany({
      where: { pacienteId },
      include: {
        doctor: { include: { usuario: true, especialidad: true } },
        sucursal: true,
        especialidad: true,
      },
      orderBy: { fechaHora: 'desc' },
    });
  }

  async citasDelDia(sucursalId?: string, doctorId?: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const where: any = { fechaHora: { gte: startOfDay, lte: endOfDay } };
    if (sucursalId) where.sucursalId = sucursalId;
    if (doctorId) where.doctorId = doctorId;

    return this.prisma.cita.findMany({
      where,
      include: {
        paciente: { include: { usuario: true } },
        doctor: { include: { usuario: true, especialidad: true } },
        sucursal: true,
        especialidad: true,
      },
      orderBy: { fechaHora: 'asc' },
    });
  }

  async create(dto: CreateCitaDto, userId?: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: dto.doctorId } });
    if (!doctor || !doctor.activo) throw new BadRequestException('Doctor no disponible');

    const conflictingCita = await this.prisma.cita.findFirst({
      where: {
        doctorId: dto.doctorId,
        fechaHora: new Date(dto.fechaHora),
        estado: { notIn: ['CANCELADA', 'REASIGNADA'] },
      },
    });
    if (conflictingCita) throw new BadRequestException('El doctor ya tiene una cita en ese horario');

    return this.prisma.cita.create({
      data: {
        pacienteId: dto.pacienteId,
        doctorId: dto.doctorId,
        sucursalId: dto.sucursalId,
        especialidadId: dto.especialidadId,
        fechaHora: new Date(dto.fechaHora),
        notas: dto.notas,
        origen: dto.origen || 'WEB',
      },
      include: {
        paciente: { include: { usuario: true } },
        doctor: { include: { usuario: true } },
        sucursal: true,
        especialidad: true,
      },
    });
  }

  async update(id: string, dto: UpdateCitaDto) {
    await this.findOne(id);
    return this.prisma.cita.update({
      where: { id },
      data: {
        fechaHora: dto.fechaHora ? new Date(dto.fechaHora) : undefined,
        notas: dto.notas,
      },
      include: {
        paciente: { include: { usuario: true } },
        doctor: { include: { usuario: true } },
        sucursal: true,
        especialidad: true,
      },
    });
  }

  async cancelar(id: string, motivo?: string) {
    const cita = await this.findOne(id);
    if (cita.estado === 'COMPLETADA') throw new BadRequestException('No se puede cancelar una cita completada');
    if (cita.estado === 'CANCELADA') throw new BadRequestException('La cita ya está cancelada');

    return this.prisma.cita.update({
      where: { id },
      data: { estado: 'CANCELADA', notas: motivo || 'Cancelada por el paciente' },
    });
  }

  async checkin(id: string) {
    const cita = await this.findOne(id);
    if (cita.estado === 'CANCELADA') throw new BadRequestException('No se puede hacer check-in de una cita cancelada');

    return this.prisma.cita.update({
      where: { id },
      data: { estado: 'CONFIRMADA', checkinAt: new Date() },
    });
  }

  async completar(id: string) {
    const cita = await this.findOne(id);
    if (cita.estado !== 'CONFIRMADA') throw new BadRequestException('Solo citas confirmadas pueden completarse');

    return this.prisma.cita.update({
      where: { id },
      data: { estado: 'COMPLETADA' },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.cita.delete({ where: { id } });
  }
}