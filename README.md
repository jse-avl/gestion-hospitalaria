# Sistema de Gestión de Citas Médicas
# Medical Appointment Management System

---

## Español

Aplicación web para la gestión de citas médicas en el sector público panameño. Permite registro de pacientes, asignación de citas con doctores en sucursales, y administración del sistema con control de acceso por roles.

### Stack

- **Backend:** NestJS 11 + Prisma ORM + PostgreSQL 16 + Redis 7
- **Frontend:** Next.js 14 (App Router) + TailwindCSS + shadcn/ui
- **Auth:** JWT (access 15min + refresh 7d con rotación) + MFA TOTP
- **Infra:** Docker Compose

### Inicio Rápido

```bash
docker compose up -d
```

| Servicio | URL |
|----------|-----|
| Portal Pacientes | http://localhost:3000 |
| Panel Admin | http://localhost:3001 |
| API | http://localhost:3002/api |

### Desarrollo Local

```bash
docker compose up -d postgres redis
pnpm install
pnpm --filter api exec prisma migrate dev
pnpm --filter api exec ts-node prisma/seed.ts
pnpm run dev
```

### Estructura

```
apps/api      Backend NestJS (puerto 3002)
apps/web      Portal pacientes (puerto 3000)
apps/admin    Panel administración (puerto 3001)
packages/     Librerías compartidas (config, tipos, UI)
```

---

## English

Web application for medical appointment management in the Panamanian public sector. Enables patient registration, appointment scheduling with doctors across branches, and system administration with role-based access control.

### Stack

- **Backend:** NestJS 11 + Prisma ORM + PostgreSQL 16 + Redis 7
- **Frontend:** Next.js 14 (App Router) + TailwindCSS + shadcn/ui
- **Auth:** JWT (15min access + 7d refresh with rotation) + MFA TOTP
- **Infra:** Docker Compose

### Quick Start

```bash
docker compose up -d
```

| Service | URL |
|---------|-----|
| Patient Portal | http://localhost:3000 |
| Admin Panel | http://localhost:3001 |
| API | http://localhost:3002/api |

### Local Development

```bash
docker compose up -d postgres redis
pnpm install
pnpm --filter api exec prisma migrate dev
pnpm --filter api exec ts-node prisma/seed.ts
pnpm run dev
```

### Structure

```
apps/api      NestJS Backend (port 3002)
apps/web      Patient portal (port 3000)
apps/admin    Admin panel (port 3001)
packages/     Shared libraries (config, types, UI)
```
