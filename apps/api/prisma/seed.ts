import { PrismaClient, Rol } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 12);

  // Admin
  const adminUser = await prisma.usuario.upsert({
    where: { email: 'admin@sistema.gob.pa' },
    update: {},
    create: {
      email: 'admin@sistema.gob.pa',
      passwordHash,
      nombre: 'Admin Sistema',
      rol: Rol.ADMIN,
    },
  });

  // Sucursales
  const sucCentral = await prisma.sucursal.create({
    data: {
      nombre: 'Policlínica Central',
      direccion: 'Av. Central, Ciudad de Panamá',
      telefono: '+507 200-0001',
      horario: { lunes: '07:00-15:00', martes: '07:00-15:00', miercoles: '07:00-15:00', jueves: '07:00-15:00', viernes: '07:00-15:00' },
      latitud: 8.9824,
      longitud: -79.5199,
    },
  });

  const sucSanMiguelito = await prisma.sucursal.create({
    data: {
      nombre: 'Policlínica San Miguelito',
      direccion: 'Vía Simón Bolívar, San Miguelito',
      telefono: '+507 200-0002',
      horario: { lunes: '07:00-15:00', martes: '07:00-15:00', miercoles: '07:00-15:00', jueves: '07:00-15:00', viernes: '07:00-15:00' },
      latitud: 9.0324,
      longitud: -79.5066,
    },
  });

  const sucJuanDiaz = await prisma.sucursal.create({
    data: {
      nombre: 'Policlínica Juan Díaz',
      direccion: 'Vía España, Juan Díaz',
      telefono: '+507 200-0003',
      horario: { lunes: '07:00-15:00', martes: '07:00-15:00', miercoles: '07:00-15:00', jueves: '07:00-15:00', viernes: '07:00-15:00' },
      latitud: 9.0153,
      longitud: -79.4687,
    },
  });

  // Especialidades
  const espCardio = await prisma.especialidad.create({ data: { nombre: 'Cardiología', descripcion: 'Atención cardiológica general', cupoMaximo: 20 } });
  const espPedia = await prisma.especialidad.create({ data: { nombre: 'Pediatría', descripcion: 'Atención pediátrica', cupoMaximo: 25 } });
  const espMedicina = await prisma.especialidad.create({ data: { nombre: 'Medicina General', descripcion: 'Consulta general', cupoMaximo: 30 } });
  const espGineco = await prisma.especialidad.create({ data: { nombre: 'Ginecología', descripcion: 'Atención ginecológica', cupoMaximo: 15 } });
  const espDerma = await prisma.especialidad.create({ data: { nombre: 'Dermatología', descripcion: 'Atención dermatológica', cupoMaximo: 15 } });

  // Link especialidades to sucursales
  for (const s of [sucCentral, sucSanMiguelito, sucJuanDiaz]) {
    for (const e of [espCardio, espPedia, espMedicina, espGineco, espDerma]) {
      await prisma.sucursalEspecialidad.create({ data: { sucursalId: s.id, especialidadId: e.id } });
    }
  }

  // Doctores
  const doctores = [
    { email: 'martinez@correo.pa', nombre: 'Dr. Martínez', esp: espCardio, suc: sucCentral },
    { email: 'rios@correo.pa', nombre: 'Dra. Ríos', esp: espCardio, suc: sucSanMiguelito },
    { email: 'mora@correo.pa', nombre: 'Dr. Mora', esp: espCardio, suc: sucJuanDiaz },
    { email: 'lopez@correo.pa', nombre: 'Dra. López', esp: espPedia, suc: sucCentral },
    { email: 'perez@correo.pa', nombre: 'Dr. Pérez', esp: espMedicina, suc: sucCentral },
  ];

  for (const d of doctores) {
    const user = await prisma.usuario.create({
      data: { email: d.email, passwordHash, nombre: d.nombre, rol: Rol.DOCTOR },
    });
    await prisma.doctor.create({
      data: { usuarioId: user.id, especialidadId: d.esp.id, sucursalId: d.suc.id },
    });
  }

  // Recepcionista
  const recepUser = await prisma.usuario.create({
    data: { email: 'recepcion@correo.pa', passwordHash, nombre: 'María Recepcionista', rol: Rol.RECEPCIONISTA },
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());