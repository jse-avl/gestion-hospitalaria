import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.paciente.findMany({
      include: { usuario: true },
    });
  }

  async findOne(id: string) {
    const pac = await this.prisma.paciente.findUnique({
      where: { id },
      include: { usuario: true, citas: { include: { doctor: { include: { usuario: true } }, especialidad: true, sucursal: true } } },
    });
    if (!pac) throw new NotFoundException('Paciente no encontrado');
    return pac;
  }

  async buscarPorCedula(cedula: string) {
    const pac = await this.prisma.paciente.findUnique({
      where: { cedula },
      include: { usuario: true },
    });
    return pac || null;
  }

  async create(dto: CreatePacienteDto) {
    const existing = await this.prisma.paciente.findUnique({ where: { cedula: dto.cedula } });
    if (existing) throw new ConflictException('Cédula ya registrada');

    const existingEmail = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existingEmail) throw new ConflictException('Email ya registrado');

    const passwordHash = await bcrypt.hash(dto.password || '123456', 12);
    const usuario = await this.prisma.usuario.create({
      data: { email: dto.email, passwordHash, nombre: dto.nombre, rol: 'PACIENTE' },
    });

    return this.prisma.paciente.create({
      data: {
        usuarioId: usuario.id,
        cedula: dto.cedula,
        telefono: dto.telefono,
        fechaNacimiento: dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : undefined,
        alergias: dto.alergias,
        condiciones: dto.condiciones,
      },
      include: { usuario: true },
    });
  }

  async update(id: string, dto: UpdatePacienteDto) {
    await this.findOne(id);
    return this.prisma.paciente.update({
      where: { id },
      data: {
        telefono: dto.telefono,
        fechaNacimiento: dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : undefined,
        alergias: dto.alergias,
        condiciones: dto.condiciones,
      },
      include: { usuario: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.paciente.delete({ where: { id } });
  }
}