# MVP Sistema de Citas Médicas — Plan de Implementación

> **For agentic workers:** Implementar task por task secuencialmente.
> **Ponytail mode:** Código mínimo, features nativas primero, sin abstracciones innecesarias.

**Goal:** Monorepo functional de gestión de citas médicas con Next.js + NestJS + Prisma + PostgreSQL + Redis

**Tech Stack:** pnpm + Turborepo, Next.js 14 App Router, NestJS, Prisma, PostgreSQL 16, Redis 7, TailwindCSS, shadcn/ui, Docker

---

## Task 1: Scaffold Monorepo + Docker

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Init root package.json con pnpm workspaces**
- [ ] **Step 2: pnpm-workspace.yaml**
- [ ] **Step 3: turbo.json**
- [ ] **Step 4: docker-compose.yml (PostgreSQL 16 + Redis 7)**
- [ ] **Step 5: .env.example**
- [ ] **Step 6: .gitignore + tsconfig.json base**
- [ ] **Step 7: pnpm install**

---

## Task 2: Shared Packages

**Files:**
- Create: `packages/shared/package.json`, `tsconfig.json`
- Create: `packages/shared/src/types/index.ts`
- Create: `packages/shared/src/constants/index.ts`
- Create: `packages/shared/src/index.ts`
- Create: `packages/config/tsconfig/base.json`, `nextjs.json`, `nest.json`

- [ ] **Step 1: Types compartidos** (DTOs, interfaces)
- [ ] **Step 2: Constantes** (Roles, Estados, Origenes)
- [ ] **Step 3: Configs base de TypeScript**

---

## Task 3: Prisma Schema + Seed

**Files:**
- Create: `apps/api/prisma/schema.prisma`
- Create: `apps/api/prisma/seed.ts`
- Create: `apps/api/package.json`, `tsconfig.json`, `nest-cli.json`

- [ ] **Step 1: Schema Prisma** (Usuario, Sucursal, Especialidad, SucursalEspecialidad, Doctor, Paciente, Cita, AuditLog)
- [ ] **Step 2: Seed data** (3 sucursales, 5 especialidades, 5 doctores, pacientes ejemplo)
- [ ] **Step 3: Migración inicial** (`pnpm --filter api exec prisma migrate dev --name init`)

---

## Task 4: NestJS Auth Module

**Files:**
- Create: `apps/api/src/main.ts`, `app.module.ts`
- Create: `apps/api/src/auth/auth.module.ts`, `controller.ts`, `service.ts`
- Create: `apps/api/src/auth/dto/login.dto.ts`, `register.dto.ts`
- Create: `apps/api/src/auth/strategies/jwt.strategy.ts`
- Create: `apps/api/src/auth/guards/jwt-auth.guard.ts`

- [ ] **Step 1: Bootstrap NestJS** con ValidationPipe, helmet, cors
- [ ] **Step 2: Auth service** (register con bcrypt costo 12, login JWT access 15min + refresh 7d, MFA TOTP)
- [ ] **Step 3: Auth controller** (POST register, login, refresh, mfa/activate, mfa/verify)

---

## Task 5: Common Layer

**Files:**
- Create: `apps/api/src/common/guards/roles.guard.ts`
- Create: `apps/api/src/common/decorators/roles.decorator.ts`, `current-user.decorator.ts`
- Create: `apps/api/src/common/interceptors/audit.interceptor.ts`
- Create: `apps/api/src/common/filters/http-exception.filter.ts`
- Create: `apps/api/src/prisma/prisma.module.ts`, `prisma.service.ts`

- [ ] **Step 1: RolesGuard + decoradores** (RBAC por endpoint)
- [ ] **Step 2: AuditInterceptor** (log operaciones críticas en AuditLog)
- [ ] **Step 3: Rate limiting** (@nestjs/throttler + Redis)
- [ ] **Step 4: PrismaModule** (conexión global Prisma)

---

## Task 6: CRUD Modules

**Files por módulo:** `module.ts`, `controller.ts`, `service.ts`

- [ ] **Step 1-5: Sucursales, Especialidades, Doctores, Pacientes, Citas**
  - Cada uno: CRUD estándar con DTOs validados, protegido por rol
  - Doctores incluye endpoint `disponibles?fecha=&sucursalId=&especialidadId=`
  - Citas incluye `mis-citas`, `del-dia`, `checkin`

---

## Task 7: UI Package (shadcn/ui)

**Files:**
- Create: `packages/ui/package.json`, `tsconfig.json`, `tailwind.config.ts`, `globals.css`
- Create: `packages/ui/src/ui/button.tsx`, `input.tsx`, `card.tsx`, `dialog.tsx`, `table.tsx`, `form.tsx`, `badge.tsx`, `select.tsx`, `calendar.tsx`
- Create: `packages/ui/src/lib/utils.ts`

- [ ] **Step 1: Setup tailwind + shadcn/ui** con tema alto contraste WCAG AAA
- [ ] **Step 2: Componentes base** (Button, Input, Card, Dialog, Table, Form, Badge, Select)

---

## Task 8: Web App Paciente (Next.js)

**Files:**
- Create: `apps/web/package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`
- Create: `apps/web/src/app/layout.tsx`, `page.tsx`
- Create: `apps/web/src/app/(auth)/login/page.tsx`, `register/page.tsx`
- Create: `apps/web/src/app/(dashboard)/layout.tsx`, `mis-citas/page.tsx`, `agendar/page.tsx`, `perfil/page.tsx`
- Create: `apps/web/src/lib/api.ts`
- Create: `apps/web/src/components/AgendarWizard.tsx`

- [ ] **Step 1: Layout + Landing**
- [ ] **Step 2: Auth pages** (login/register con validación)
- [ ] **Step 3: Wizard agendar cita** (4 pasos: Sucursal > Especialidad > Doctor > Confirmar)
- [ ] **Step 4: Mis citas + perfil**

---

## Task 9: Admin App (Next.js)

**Files:**
- Create: `apps/admin/package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`
- Create: `apps/admin/src/app/layout.tsx`
- Create: `apps/admin/src/app/(auth)/login/page.tsx`
- Create: `apps/admin/src/app/(dashboard)/layout.tsx`, `page.tsx`
- Create: `apps/admin/src/app/(dashboard)/citas/page.tsx`
- Create: `apps/admin/src/app/(dashboard)/sucursales/page.tsx`, `sucursales/[id]/page.tsx`
- Create: `apps/admin/src/app/(dashboard)/especialidades/page.tsx`
- Create: `apps/admin/src/app/(dashboard)/doctores/page.tsx`
- Create: `apps/admin/src/app/(dashboard)/pacientes/page.tsx`
- Create: `apps/admin/src/lib/api.ts`

- [ ] **Step 1: Dashboard layout** (sidebar + header)
- [ ] **Step 2: Dashboard home** (cards resumen)
- [ ] **Step 3: CRUD tables** para cada entidad
- [ ] **Step 4: Vista recepcionista** (crear cita rápida < 30s)

---

## Task 10: Integración Final + Audit

- [ ] **Step 1: Conectar AuditInterceptor** a endpoints de Cita
- [ ] **Step 2: Proxies API Routes** en apps web/admin hacia NestJS
- [ ] **Step 3: Flujo completo** (registro > login > agendar > admin > check-in)

---

## Task 11: Verificación

- [ ] **Step 1: Lint** (`pnpm lint`)
- [ ] **Step 2: Build** (`pnpm build`)
- [ ] **Step 3: Docker up + test** (`docker compose up -d`)
