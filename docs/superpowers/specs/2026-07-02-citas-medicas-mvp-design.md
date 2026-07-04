# Spec: Sistema de Gestión de Citas Médicas — Sector Público (MVP)

> Basado en PRD_Sistema_Citas_Medicas_Sector_Publico.md
> Stack: pnpm + Turborepo | Next.js 14 + TailwindCSS + shadcn/ui | NestJS + Prisma | PostgreSQL + Redis | Docker

## Alcance del MVP

Monorepo funcional con 3 apps (web paciente, admin recepcionista, API NestJS) operando localmente con Docker. Incluye seguridad desde el inicio: JWT + MFA, RBAC, rate limiting, sanitización 3 capas, audit trails.

## Modelo de Datos

7 modelos: Usuario, Sucursal, Especialidad, SucursalEspecialidad, Doctor, Paciente, Cita, AuditLog.

## API

20+ endpoints REST agrupados en: Auth, Sucursales, Especialidades, Doctores, Pacientes, Citas, Audit.

## Frontends

- **Web paciente**: Landing, auth, wizard agendar cita (4 pasos), mis citas, perfil. Diseño adultos mayores.
- **Admin**: Dashboard, CRUD completo, vista recepcionista con creación rápida de citas.
