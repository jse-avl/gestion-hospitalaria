# PRD: Sistema de Gestión de Citas Médicas — Sector Público (Panamá)

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Package Manager | **pnpm** (monorepo workspace) |
| Frontend | Next.js 14+ / TypeScript / TailwindCSS / shadcn/ui |
| Backend | NestJS / TypeScript / Prisma ORM |
| Base de Datos | PostgreSQL (AWS RDS Multi-AZ) |
| Caché | Redis (AWS ElastiCache) |
| Infraestructura | AWS (ECS Fargate, CloudFront, WAF, API Gateway, S3) |
| Monitoreo | Datadog / Sentry / CloudWatch |
| CI/CD | GitHub Actions + pnpm audit + Snyk |

> **pnpm** se elige sobre npm/yarn por: almacenamiento global con hard links (70% menos espacio), strict mode que previene acceso a dependencias no declaradas, y velocidad de instalación significativamente mayor. El monorepo con pnpm workspace permite compartir tipos, DTOs y validadores entre frontend y backend sin duplicación.

---

## Tabla de Contenidos

1. [Contexto de Ciberseguridad en Panamá](#1-contexto-de-ciberseguridad-en-panamá)
2. [Sanitización y Validación de Datos](#2-sanitización-y-validación-de-datos)
3. [Cifrado: AES y TLS](#3-cifrado-aes-y-tls)
4. [Roles y Permisos del Sistema](#4-roles-y-permisos-del-sistema)
5. [Reasignación Inteligente de Citas](#5-reasignación-inteligente-de-citas)
6. [Gestión de Sucursales](#6-gestión-de-sucursales)
7. [Experiencia de Usuario (UX)](#7-experiencia-de-usuario-ux)
8. [Arquitectura del Sistema](#8-arquitectura-del-sistema)
9. [Ciberseguridad Avanzada](#9-ciberseguridad-avanzada)
10. [Interoperabilidad con Sistemas del Estado](#10-interoperabilidad-con-sistemas-del-estado)
11. [Accesibilidad para Baja Conectividad y Bajo Alfabetismo Digital](#11-accesibilidad-para-baja-conectividad-y-bajo-alfabetismo-digital)
12. [Cumplimiento de Contrataciones Públicas](#12-cumplimiento-de-contrataciones-públicas)
13. [Alto Volumen y Walk-ins](#13-alto-volumen-y-walk-ins)
14. [Integración con Farmacia y Dispensación CSS](#14-integración-con-farmacia-y-dispensación-css)
15. [Gobernanza y Rendición de Cuentas](#15-gobernanza-y-rendición-de-cuentas)
16. [Checklist de Pre-Lanzamiento](#16-checklist-de-pre-lanzamiento)
17. [Conclusión Final](#17-conclusión-final)
18. [Diferencias Clave vs. Variante Privada](#18-diferencias-clave-vs-variante-privada)

---

## 1. Contexto de Ciberseguridad en Panamá

Panamá ha experimentado un aumento exponencial de ciberataques contra instituciones de salud durante 2025–2026. La Autoridad Nacional para la Innovación Gubernamental (AIG) reportó incrementos de hasta **500%** en intentos de ataques contra infraestructura crítica. El Estado panameño invirtió más de **$20 millones** en ciberseguridad.

### 1.1 Caja de Seguro Social (CSS) — Abril 2026

El ciberataque más grave en la historia de Panamá. El grupo **The Gentlemen** expuso **3 TB** de datos sensibles: historiales médicos completos, firmas digitalizadas, datos financieros de miles de asegurados, y registros de nómina. Los datos fueron publicados en la dark web tras no recibir rescate.

- **Datos expuestos**: Historias clínicas, información de dependientes, planilla completa del Estado
- **Vector de ataque**: No confirmado públicamente, pero se sospecha phishing dirigido a empleados administrativos
- **Impacto**: Pérdida de confianza en la institución, posible fraude de identidad masivo, demandas colectivas

### 1.2 MiniMed Panama — Febrero 2026

**400,000 registros de pacientes filtrados**. El hallazgo más crítico: credenciales de administradores almacenadas en **texto plano**, sin hashing ni cifrado. La base de datos era accesible desde internet sin autenticación adecuada.

- **Lección principal**: El texto plano en credenciales es inaceptable. Este sistema implementa bcrypt (costo 12+) o Argon2id para todas las contraseñas
- **Acceso**: Firewall de base de datos con whitelist de IPs, nunca exponer directamente a internet
- **Monitorización**: Detección de accesos anómalos a la base de datos

### 1.3 MINSA SIMEPLANS — Septiembre 2025

Acceso no autorizado al Sistema de Información del Ministerio de Salud. Evidenció vulnerabilidades en la infraestructura crítica de salud del Estado panameño, incluyendo falta de segmentación de red y controles de acceso deficientes.

### 1.4 Caída del Sistema CSS — Mayo 2026

Sistema caído más de una semana en la **Policlínica Manuel Ferrer Valdés**. Imposibilitó la asignación de citas médicas y la entrega de medicamentos a pacientes crónicos. Demostró la necesidad crítica de disponibilidad y redundancia.

### 1.5 Patrón de Ataques

Otras instituciones atacadas en el mismo período:
- **Mitradel**: Filtración de datos laborales
- **MEF**: Intento de compromiso del sistema financiero del Estado
- **Panamá Emprende**: Datos de contribuyentes comprometidos

La AIG confirmó **5 incidentes de alto impacto** solo en el primer semestre de 2026. El patrón muestra ataques dirigidos a infraestructura crítica con fines de extorsión y exposición de datos sensibles.

---

## 2. Sanitización y Validación de Datos

### 2.1 Sanitización en Tres Capas

Toda entrada de usuario se sanitiza en tres capas independientes:

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| **Cliente (Frontend)** | HTML5 validation + Zod schemas | Feedback visual inmediato, prevenir requests inválidas |
| **API (Backend)** | NestJS ValidationPipe + class-validator | Validación estricta de DTOs, transformación de tipos |
| **Base de Datos** | Prisma parameterized queries | Prevención SQL injection |

### 2.2 Protección Específica

- **XSS**: DOMPurify en frontend para sanitizar HTML renderizado; helmet.js con CSP estricta en backend
- **SQL Injection**: Prisma usa parameterized queries (bind variables) exclusivamente — nunca interpolación de strings
- **NoSQL Injection**: mongo-sanitize en cualquier capa NoSQL
- **Command Injection**: Validación estricta de entradas que pasan a exec/spawn; whitelist de comandos permitidos
- **SSRF**: URL whitelist para webhooks externos; bloqueo de rangos de IP privadas (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
- **LDAP Injection**: Escape de caracteres especiales en autenticación LDAP
- **File Upload**: Validación de tipo MIME real (no solo extensión), escaneo con ClamAV, límite de 10 MB

### 2.3 Validación de Schemas

- **OpenAPI 3.1**: Validación automática de requests y responses contra spec
- **HL7 FHIR R4**: Schemas clínicos para interoperabilidad
- **DTOs tipados**: Validación de tipos, rangos, formatos, longitudes máximas y reglas de negocio

### 2.4 CSP (Content Security Policy)

```
default-src 'self';
script-src 'self' https://trusted-cdn.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://*.amazonaws.com;
connect-src 'self' https://api.sistema-citas.gob.pa;
frame-ancestors 'none';
form-action 'self';
base-uri 'self';
```

---

## 3. Cifrado: AES y TLS

### 3.1 Cifrado en Tránsito — TLS 1.3

TLS 1.3 es el protocolo de seguridad para todas las comunicaciones en tránsito. Implementado en AWS CloudFront con certificados ACM (AWS Certificate Manager).

#### ¿Qué es TLS?

TLS (Transport Layer Security) es el protocolo que cifra la comunicación entre el cliente (navegador, app móvil) y el servidor. Impide que un atacante intercepte, lea o modifique los datos en tránsito (ataque man-in-the-middle).

#### TLS 1.3 vs versiones anteriores

| Característica | TLS 1.2 | TLS 1.3 |
|---------------|---------|---------|
| Handshake | 2 round-trips (2-RTT) | 1 round-trip (1-RTT), 0-RTT para reanudación |
| Cifrados inseguros | Soporta RC4, CBC, 3DES | Eliminados todos |
| Forward Secrecy | Opcional | Obligatorio (ECDHE) |
| Tiempo de handshake | ~225 ms | ~125 ms |

#### Configuración

```
Cifrados permitidos:
  - TLS_AES_128_GCM_SHA256
  - TLS_AES_256_GCM_SHA384

HSTS: max-age=31536000; includeSubDomains; preload
mTLS: Obligatorio entre microservicios backend
OCSP Stapling: Habilitado
```

### 3.2 Cifrado en Reposo — AES-256-GCM

AES-256-GCM (Advanced Encryption Standard, 256-bit key, Galois/Counter Mode) es el estándar para cifrado simétrico de datos sensibles en reposo.

#### ¿Qué es AES?

AES es un cifrado de bloque simétrico adoptado como estándar por el gobierno de EE.UU. Utiliza la misma clave para cifrar y descifrar. Con clave de 256 bits, ofrece 2^256 combinaciones posibles — imposible de romper por fuerza bruta con tecnología actual.

#### ¿Qué es GCM?

GCM (Galois/Counter Mode) es un modo de operación que proporciona **autenticación integrada** (AEAD — Authenticated Encryption with Associated Data). Esto significa que además de cifrar, garantiza que los datos no han sido modificados. Cualquier alteración del ciphertext es detectada.

#### Implementación

```
Algoritmo: AES-256-GCM
Tamaño de clave: 256 bits
IV (Nonce): 96 bits único por operación de cifrado
Tag de autenticación: 128 bits
Modo: AEAD (cifrado + autenticación)
```

#### Gestión de Claves

- **AWS KMS**: Clave maestra con rotación automática cada 90 días
- **DEK (Data Encryption Key)**: Clave única por registro, envuelta con la clave maestra
- **HSM**: AWS CloudHSM para operaciones criptográficas críticas
- **Secrets Manager**: Credenciales en runtime con rotación automática
- **Principio de mínimo privilegio**: Cada servicio solo accede a las claves que necesita

### 3.3 Datos Cifrados por Categoría

| Categoría | Cifrado | Algoritmo |
|-----------|---------|-----------|
| Contraseñas | Hash + Salt | bcrypt (costo 12) o Argon2id |
| Datos de salud (PII) | Cifrado simétrico | AES-256-GCM |
| Documentos adjuntos | Cifrado en S3 | AES-256 (SSE-S3 o SSE-KMS) |
| Backups | Cifrado completo | AES-256 (S3 Server-Side Encryption) |
| Logs | Cifrado en tránsito + reposo | TLS 1.3 + AES-256 |
| Tokens de sesión | Firma HMAC | HS256 (JWT) |

---

## 4. Roles y Permisos del Sistema

### 4.1 Administrador del Sistema

El **Administrador** tiene control total del sistema:

| Funcionalidad | Descripción |
|--------------|-------------|
| Gestión de usuarios | Crear, editar, desactivar doctores, recepcionistas, pacientes |
| Configuración de sucursales | Crear/editar sucursales, horarios, capacidad |
| Especialidades médicas | CRUD de especialidades, asignación a doctores |
| Reportes y auditoría | Logs de acceso, estadísticas, exportación de datos |
| Límites de cupos | Configurar cupos máximos por sucursal/especialidad |
| Reglas de reasignación | Definir algoritmo y prioridades |
| Respaldo | Gestión de backups, restauración |
| Seguridad | Panel de monitoreo, revisión de intentos fallidos, MFA enforcement |
| Configuración global | Parámetros del sistema, integraciones, webhooks |

### 4.2 Recepcionista

El **Recepcionista** es la puerta de entrada para pacientes presenciales (especialmente adultos mayores que no usan tecnología):

| Funcionalidad | Descripción |
|--------------|-------------|
| Crear citas | En nombre del paciente: seleccionar sucursal → especialidad → doctor → fecha/hora |
| Buscar paciente | Por cédula, nombre o teléfono; registrar nuevo paciente rápido |
| Modificar citas | Reprogramar, cancelar, cambiar sucursal/doctor |
| Check-in | Registrar llegada del paciente a la sucursal |
| Comprobante | Imprimir o enviar comprobante de cita vía WhatsApp |
| Calendario diario | Vista de todas las citas del día con filtros |
| Notificaciones | Informar al paciente sobre cambios o recordatorios |
| Reasignación | Gestionar citas cuando un doctor no asiste |

**Flujo de creación de cita (menos de 30 segundos):**

1. Buscar paciente por cédula (o crear nuevo — nombre, cédula, teléfono)
2. Seleccionar sucursal (mapa o lista)
3. Seleccionar especialidad
4. Mostrar doctores disponibles con horarios
5. Seleccionar fecha y hora
6. Confirmar → sistema envía notificación automática al paciente

### 4.3 Doctor

| Funcionalidad | Descripción |
|--------------|-------------|
| Agenda diaria | Ver citas del día con datos del paciente |
| Historial clínico | Acceso a historial de pacientes asignados |
| Notas médicas | Actualizar notas, diagnósticos, recetas |
| Disponibilidad | Marcar días/horarios disponibles, solicitar bloqueo |
| Confirmación | Confirmar asistencia al inicio del día |
| Solicitar reasignación | Reportar que no podrá atender → activa motor de reasignación |

### 4.4 Paciente (Autoservicio Web/App)

| Funcionalidad | Descripción |
|--------------|-------------|
| Agendar cita | Elegir sucursal → especialidad → doctor → horario |
| Reprogramar | Cambiar fecha, hora, sucursal o doctor |
| Cancelar | Cancelar cita con antelación mínima configurable |
| Recordatorios | Recibir notificaciones vía WhatsApp/SMS/Email |
| Historial | Ver citas pasadas y próximas |
| Preferencias | Doctor favorito, sucursal preferida |
| Perfil | Datos personales, contacto, alergias, condiciones |

---

## 5. Reasignación Inteligente de Citas

### 5.1 Escenario: Doctor No Asiste

Cuando un doctor no asiste (no-show sin aviso, incapacidad médica, permiso de emergencia), el sistema activa automáticamente el **motor de reasignación**:

1. Identifica todas las citas del día afectadas por la ausencia
2. Busca doctores **de la misma especialidad** con disponibilidad
3. Calcula ventanas horarias óptimas para cada cita
4. Propone reasignaciones sin cambiar la fecha (mismo día si es posible)
5. Envía opciones al paciente para confirmación

### 5.2 Algoritmo de Prioridades

| Prioridad | Criterio |
|-----------|---------|
| 1 | Mismo doctor — si resuelve su ausencia (ej. llegó tarde pero atenderá después) |
| 2 | Misma especialidad, misma sucursal, mismo horario aproximado |
| 3 | Misma especialidad, misma sucursal, diferente horario |
| 4 | Misma especialidad, otra sucursal (con aviso al paciente) |
| 5 | Misma especialidad, próximo día hábil si no hay disponibilidad hoy |

### 5.3 Interfaz de Reasignación (Recepcionista)

```
┌─────────────────────────────────────────────────────┐
│  DOCTOR AUSENTE: Dr. Martínez (Cardiología)         │
│  12 citas afectadas — 4 disponibles para reasignar  │
├─────────────────────────────────────────────────────┤
│  Alternativas disponibles:                          │
│                                                     │
│  ┌──────────────┬──────────┬───────────┬─────────┐ │
│  │ Paciente     │ Hora     │ Dr. Alt.  │ Estado  │ │
│  ├──────────────┼──────────┼───────────┼─────────┤ │
│  │ Juan Pérez   │ 09:00    │ Dra. Ríos │ ✓ Auto  │ │
│  │ María López  │ 09:30    │ Dra. Ríos │ ✓ Auto  │ │
│  │ Carlos Ruiz  │ 10:00    │ —         │ ⚠ Manual│ │
│  │ Ana Gómez    │ 10:30    │ Dr. Mora  │ ✓ Auto  │ │
│  └──────────────┴──────────┴───────────┴─────────┘ │
│                                                     │
│  [Reasignar todas automáticas]  [Reasignar manual]  │
└─────────────────────────────────────────────────────┘
```

### 5.4 Notificación al Paciente

```
[WhatsApp/SMS/Email]
"Estimado/a {paciente}, el Dr. {original} no podrá atenderle
el {fecha} a las {hora}. Hemos reasignado su cita:

🩺 Dr. {alternativo} — {especialidad}
📍 {sucursal}
🕐 {nuevo_horario}

Confirme con un clic: [✓ Confirmar] [✗ Ver otras opciones]
"
```

---

## 6. Gestión de Sucursales

### 6.1 Selección de Sucursal por el Paciente

El paciente puede elegir la sucursal al agendar su cita. El sistema muestra:

- **Mapa interactivo** con todas las sucursales y su distancia
- **Filtros**: Por zona/distrito, por especialidad, por disponibilidad
- **Detalle**: Dirección, teléfono, horario, doctores asignados, servicios disponibles
- **Disponibilidad en tiempo real**: Cupos restantes por especialidad

Al seleccionar una sucursal, se filtran automáticamente especialidades, doctores y horarios disponibles en esa ubicación.

### 6.2 Configuración por Sucursal

| Parámetro | Descripción |
|-----------|-------------|
| Horario | Días y horas de operación |
| Capacidad | Cupos máximos por especialidad/día |
| Doctores | Lista de doctores asignados con horarios |
| Especialidades | Especialidades ofrecidas en la sucursal |
| Servicios | Tipos de consulta, exámenes, procedimientos |
| Días feriados | Calendario de días no laborables |

### 6.3 Sucursal más Cercana

- **Geolocalización opcional**: El sistema sugiere la sucursal más cercana según ubicación del paciente
- **Búsqueda multi-sucursal**: Si el paciente tiene flexibilidad, muestra disponibilidad en todas las sucursales cercanas
- **Tiempo estimado de viaje**: Integración con Google Maps / Waze para estimar llegada

### 6.4 Vista para el Recepcionista

```
┌──────────────────────────────────────────────────────────┐
│  CREAR CITA — Paso 1 de 4: Sucursal                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐                                        │
│  │ 🏥 Sucursal │  ────  ┌──────────────┐               │
│  │ Central     │        │ 🩺 Cardiología│               │
│  │ 12 citas hoy│        │ 4 doctores    │               │
│  └─────────────┘        └──────────────┘               │
│                                                          │
│  ┌─────────────┐        ┌──────────────┐               │
│  │ 🏥 Sucursal │        │ 🩺 Pediatría │               │
│  │ San Miguelito│        │ 2 doctores   │               │
│  │ 8 citas hoy  │        └──────────────┘               │
│  └─────────────┘                                        │
│                                                          │
│  ┌─────────────┐                                        │
│  │ 🏥 Sucursal │                                        │
│  │ Juan Díaz   │                                        │
│  │ 15 citas hoy│                                        │
│  └─────────────┘                                        │
│                                                          │
│  [Siguiente: Especialidad →]                            │
└──────────────────────────────────────────────────────────┘
```

---

## 7. Experiencia de Usuario (UX)

### 7.1 Diseño para Adultos Mayores

Diseñado específicamente para la población panameña, donde los adultos mayores representan una mayoría de usuarios del sistema de salud:

| Principio | Implementación |
|-----------|---------------|
| Tipografía grande | Mínimo 16px, ideal 20px para cuerpo; 24–32px para títulos |
| Alto contraste | WCAG AAA (ratio de contraste 7:1 mínimo) |
| Botones amplios | Mínimo 48×48 px, con iconos descriptivos |
| Flujo paso a paso | Wizard con indicador de progreso, 4 pasos máximos |
| Sin distracciones | Pantalla completa por paso, elementos mínimos |
| Asistencia humana | Número de teléfono visible en cada pantalla |
| Feedback visual | Confirmaciones claras, animaciones suaves |
| Tiempo generoso | Sesiones largas (60 min), sin timeout agresivo |

### 7.2 Flujo de Agendamiento (3 clics desde búsqueda)

```
Paciente → Buscar cita → Seleccionar sucursal → Seleccionar especialidad
  → Seleccionar doctor/hora → Confirmar → Recibir notificación
```

### 7.3 Asistencia Presencial (Recepcionista)

Para pacientes que no usan tecnología, el Recepcionista agenda en **menos de 30 segundos**:

1. Buscar por cédula (o registrar nuevo paciente: nombre + cédula + teléfono)
2. Seleccionar sucursal (icono grande con nombre)
3. Seleccionar especialidad (lista con iconos)
4. Mostrar horarios disponibles (formato hora grande: "9:00 AM")
5. Confirmar cita → notificación automática al paciente

### 7.4 Multi-idioma y Accesibilidad

- **Idiomas**: Español, Inglés, Guna (compatible con comunidades indígenas)
- **WCAG**: Cumplimiento 2.2 AA mínimo, AAA ideal
- **Screen readers**: Compatibilidad con NVDA, JAWS, VoiceOver
- **Navegación por teclado**: Completa, con indicadores de foco visibles
- **Modo alto contraste**: Alternable desde cualquier pantalla

### 7.5 Responsive Design

- **Mobile-first**: Prioridad a dispositivos móviles (mayoría de usuarios)
- **Tablet**: Optimizado para tablets de recepcionistas
- **Desktop**: Dashboard completo para administradores
- **Offline**: Service Worker con funcionalidad básica offline

---

## 8. Arquitectura del Sistema

### 8.1 Diagrama de Arquitectura

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                                    CLIENTES                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                         │
│  │ Web App  │  │ App Móvil│  │ WhatsApp │  │ SMS      │                         │
│  │ Next.js  │  │ ReactNat.│  │ API      │  │ Gateway  │                         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘                         │
│       │              │              │     SMS     │                               │
│       │              │              │   Degradado │                               │
├───────┼──────────────┼──────────────┼──────┼──────┼───────────────────────────────┤
│       │              │              │      │      │                               │
│  ┌────▼──────────────▼──────────────▼──────┼──────▼──────────────────────┐        │
│  │                    AWS CloudFront + WAF  │                             │        │
│  │                 (CDN, DDoS Protection, SSL Termination)               │        │
│  └────────────────────────────┬────────────┼─────────────────────────────┘        │
│                               │            │                                      │
│  ┌────────────────────────────▼────────────┼──────────────────────────────┐       │
│  │                     AWS API Gateway + ALB│                             │       │
│  │                (Rate Limiting, Auth, Request Validation)              │       │
│  └──┬───────────────┬───────────────┬───────────────────┬────────────────┘       │
│     │               │               │                   │                         │
│  ┌──▼─────────┐ ┌──▼─────────┐ ┌──▼─────────┐ ┌──▼───────────────────┐          │
│  │ Auth       │ │ Citas      │ │ Médicos    │ │ Interoperabilidad    │          │
│  │ Service    │ │ Service    │ │ Service    │ │ Gubernamental        │          │
│  │            │ │            │ │            │ │ Service              │          │
│  │ JWT+MFA    │ │ NestJS     │ │ NestJS     │ │                      │          │
│  │ NestJS     │ │            │ │            │ │ mTLS ↔ CSS, MINSA,   │          │
│  ├────────────┤ ├────────────┤ ├────────────┤ │ Tribunal Electoral,  │          │
│  │ Postgres   │ │ Postgres   │ │ Postgres   │ │ RAISA                │          │
│  │ (RDS Multi │ │ (RDS Multi │ │ (RDS Multi │ ├──────────────────────┤          │
│  │  AZ)       │ │  AZ)       │ │  AZ)       │ │ Gobierno Gateway    │          │
│  └────────────┘ └────────────┘ └────────────┘ │ (API Segura)        │          │
│                                                └──────────┬───────────┘          │
│                                                           │                      │
│  ┌─────────────────────────────────────────────────────────▼────────────────┐     │
│  │                            Sistemas Externos del Estado                   │     │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────┐  ┌──────────────┐  │     │
│  │  │ CSS API    │  │ MINSA      │  │ Tribunal       │  │ RAISA Legacy │  │     │
│  │  │            │  │ SIMEPLANS  │  │ Electoral      │  │              │  │     │
│  │  └────────────┘  └────────────┘  └────────────────┘  └──────────────┘  │     │
│  └──────────────────────────────────────────────────────────────────────────┘     │
│                                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────────┐     │
│  │                          Redis Cache (ElastiCache)                        │     │
│  │               (Sesiones, Rate Limiting, Cola de Notificaciones)           │     │
│  └──────────────────────────────────────────────────────────────────────────┘     │
│                                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────────┐     │
│  │                          AWS Services (Shared)                            │     │
│  │  S3 (Docs) │ KMS (Keys) │ SQS (Queue) │ SES (Email) │ CloudWatch        │     │
│  │  X-Ray │ Secrets Mgr │ Cognito                                           │     │
│  └──────────────────────────────────────────────────────────────────────────┘     │
│                                                                                   │
│  ┌──────────────────────┐                                                         │
│  │   Red Móvil (Telcos) │◄──── SMS Modo Degradado (sin internet)                  │
│  └──────────────────────┘                                                         │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Base de Datos (Diagrama ER)

```
┌─────────────┐     ┌───────────────┐     ┌──────────────┐
│  Sucursal   │─────│  Especialidad │─────│   Doctor     │
├─────────────┤     ├───────────────┤     ├──────────────┤
│ id          │     │ id            │     │ id           │
│ nombre      │     │ nombre        │     │ nombre       │
│ direccion   │     │ descripcion   │     │ especialidad │
│ telefono    │     │ cupo_maximo   │     │ sucursal_id  │
│ horario     │     └───────────────┘     │ email        │
│ latitud     │          │                │ telefono     │
│ longitud    │          │                │ horario      │
│ activa      │          │                │ activo       │
└─────────────┘          │                └──────┬───────┘
                         │                       │
                         │  ┌────────────────────┘
                         │  │
                    ┌────▼──▼────────────────┐
                    │        Cita            │
                    ├────────────────────────┤
                    │ id                     │
                    │ paciente_id            │
                    │ doctor_id              │
                    │ sucursal_id            │
                    │ especialidad_id        │
                    │ fecha_hora             │
                    │ estado (pendiente/     │
                    │   confirmada/          │
                    │   completada/          │
                    │   cancelada/           │
                    │   reasignada)          │
                    │ origen (web/app/       │
                    │   recepcionista)       │
                    │ notas                  │
                    │ created_at             │
                    │ updated_at             │
                    └────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │     Paciente       │
                    ├────────────────────┤
                    │ id                 │
                    │ cedula (único)     │
                    │ nombre             │
                    │ telefono           │
                    │ email              │
                    │ fecha_nacimiento   │
                    │ alergias           │
                    │ condiciones        │
                    │ preferencias       │
                    └────────────────────┘
```

### 8.3 pnpm Workspace (Monorepo)

```
sistema-citas/
├── pnpm-workspace.yaml
├── packages/
│   ├── shared/
│   │   ├── types/        # DTOs, interfaces compartidas
│   │   ├── validators/   # Schemas Zod / class-validator
│   │   └── utils/        # Utilidades compartidas
│   ├── config/
│   │   ├── eslint/       # Config ESLint compartida
│   │   ├── tsconfig/     # Base tsconfig
│   │   └── tailwind/     # Config Tailwind compartida
│   └── ui/               # Componentes UI compartidos (shadcn)
├── apps/
│   ├── web/              # Next.js (paciente)
│   ├── admin/            # Next.js (admin/recepcionista)
│   └── api/              # NestJS (backend)
└── pnpm-lock.yaml
```

---

## 9. Ciberseguridad Avanzada

### 9.1 Estrategia de Cifrado

#### 9.1.1 Cifrado en Tránsito

- **TLS 1.3** como estándar mínimo, TLS 1.2 solo como fallback con cifrados seguros
- Certificados ACM renovados automáticamente
- mTLS entre microservicios
- HSTS con preload

#### 9.1.2 Cifrado en Reposo

- AES-256-GCM para datos sensibles (PII, historias clínicas)
- AWS KMS con rotación automática
- Cifrado del lado del servidor para backups y logs

#### 9.1.3 Gestión de Secretos

- AWS Secrets Manager con rotación automática
- Variables de entorno cifradas en CI/CD
- Nunca hardcodear credenciales

### 9.2 Gestión de Acceso y Identidad

#### 9.2.1 Autenticación

- **MFA obligatorio** para administradores y doctores
- Métodos: TOTP, SMS, notificación push
- **JWT** con rotación cada 15 minutos
- Refresh tokens rotados en cada uso

#### 9.2.2 Control de Acceso (RBAC)

```
Roles: ADMIN > RECEPCIONISTA > DOCTOR > PACIENTE
Cada rol solo ve y modifica los recursos que le corresponden.
Políticas evaluadas en cada request (no solo en frontend).
```

#### 9.2.3 Sesiones

- Timeout de inactividad: 60 min (paciente), 30 min (recepcionista)
- Forzar cierre de sesión remoto (admin puede invalidar cualquier sesión)
- Detección de sesiones concurrentes sospechosas

### 9.3 Prevención de Ataques

#### 9.3.1 OWASP Top 10:2025

| Categoría | Mitigación |
|-----------|-----------|
| A01: Broken Access Control | RBAC + validación por request |
| A02: Cryptographic Failures | AES-256-GCM + TLS 1.3 |
| A03: Injection | Parameterized queries + sanitización 3 capas |
| A04: Insecure Design | Threat modeling en cada feature |
| A05: Security Misconfiguration | IaC (Terraform) + AWS Config |
| A06: Vulnerable Components | pnpm audit + Snyk + Dependabot |
| A07: Auth Failures | MFA + rate limiting + JWT rotados |
| A08: Data Integrity Failures | Firmas digitales + audit trails |
| A09: Logging Failures | CloudWatch + Datadog + alertas |
| A10: SSRF | URL whitelist + bloqueo loopback |

#### 9.3.2 CORS (Cross-Origin Resource Sharing)

CORS es un mecanismo de seguridad del navegador que controla qué dominios pueden acceder a los recursos del servidor. Sin CORS, cualquier sitio web podría hacer requests a la API desde el navegador del usuario.

**Configuración estricta:**

```
Access-Control-Allow-Origin: https://app.sistema-citas.gob.pa
Access-Control-Allow-Origin: https://admin.sistema-citas.gob.pa
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

**NUNCA usar `Access-Control-Allow-Origin: *`** en producción.

El servidor valida el header `Origin` contra la whitelist antes de responder. Si el origen no está autorizado, devuelve 403 Forbidden.

#### 9.3.3 Rate Limiting

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| Login | 5 requests | 1 minuto |
| API general | 100 requests | 1 minuto |
| Crear cita | 20 requests | 1 minuto |
| Búsqueda | 60 requests | 1 minuto |
| Password reset | 3 requests | 1 hora |

#### 9.3.4 WAF (Web Application Firewall)

- AWS WAF con OWASP Core Rule Set
- Reglas de rate limiting a nivel de CloudFront
- IP blacklist automática (5 intentos fallidos = bloqueo 24h)
- Protección DDoS con AWS Shield Advanced

### 9.4 Infraestructura Segura

- **VPC** con subredes públicas y privadas
- **NAT Gateway** para instancias en subredes privadas
- **Security Groups** con mínimo privilegio
- **AWS Config** para monitoreo de cambios de configuración
- **GuardDuty** para detección de amenazas
- **CloudTrail** para auditoría de API calls
- **WAF** en perímetro

### 9.5 Seguridad en Desarrollo

- **Pre-commit hooks**: Husky + lint-staged para linting y pruebas
- **SAST**: SonarQube en cada PR
- **SCA**: pnpm audit + Snyk + Dependabot
- **Pruebas de penetración**: Anuales obligatorias
- **Revisión de código**: Todo cambio revisado por otro desarrollador
- **Secret scanning**: git-secrets + pre-commit hook

### 9.6 Audit Trails

Toda operación crítica se registra:

| Evento | Datos | Retención |
|--------|-------|-----------|
| Login exitoso | usuario, IP, user-agent, timestamp | 1 año |
| Login fallido | usuario, IP, intento, timestamp | 1 año |
| Creación de cita | quién, a quién, cuándo, sucursal | 5 años |
| Modificación de cita | quién, qué cambió, antes/después | 5 años |
| Cancelación | quién, motivo, timestamp | 5 años |
| Acceso a datos sensibles | quién, qué datos, IP | 3 años |
| Cambio de permisos | admin, qué cambio, timestamp | 5 años |

### 9.7 Plan de Respuesta a Incidentes

| Fase | Acción | Tiempo |
|------|--------|--------|
| 1. Detección | Alerta automática (CloudWatch, GuardDuty, Datadog) | < 5 min |
| 2. Contención | Aislar sistema comprometido, revocar accesos | < 15 min |
| 3. Erradicación | Eliminar amenaza, parchear vulnerabilidad | < 4 h |
| 4. Recuperación | Restaurar desde backup, verificar integridad | < 8 h |
| 5. Post-mortem | Análisis de causa raíz, mejorar defensas | < 48 h |

---

## 10. Interoperabilidad con Sistemas del Estado

### 10.1 Integración con MINSA SIMEPLANS

- Consulta cruzada de historial clínico: cuando un paciente fue atendido en redes CSS y MINSA, el sistema puede recuperar su historial unificado (con consentimiento del paciente).
- API REST con autenticación mutual TLS (mTLS) entre dominios gubernamentales.
- Mapeo de pacientes: cruce por cédula para identificar registros duplicados entre ambas instituciones.

### 10.2 Validación de Identidad contra Tribunal Electoral

- Verificación en tiempo real de: número de cédula, nombre completo, foto, estado civil.
- Prevención de suplantación de identidad al agendar citas (un paciente no puede agendar con cédula ajena).
- Integración vía API del Tribunal Electoral (o web service legacy).
- Cacheo temporal de datos validados (TTL: 24h) para reducir llamadas.

### 10.3 Verificación de Estatus CSS

- Consulta en tiempo real del estatus de cotizante/beneficiario CSS.
- Verificar si el paciente tiene derecho a atención (activo, jubilado, beneficiario).
- Mostrar advertencia si el estatus está suspendido o vencido.
- Registro de consulta para auditoría.

### 10.4 Plan de Migración desde RAISA

- Mapeo de campos entre RAISA (legacy) y el nuevo sistema.
- Validación de integridad de datos migrados (total de registros, checksums, detección de anomalías).
- Período de convivencia: ambos sistemas operan en paralelo durante 3 meses.
- Estrategia de rollback si la migración presenta errores críticos.
- Tabla de mapeo de campos incluida:

| Campo RAISA | Campo Nuevo Sistema | Tipo | Transformación |
|---|---|---|---|
| PACIENTE_ID | id | UUID | Generar nuevo UUID, preservar ID legacy en campo `legacy_id` |
| PAC_NOMBRE | nombre | String | Limpiar espacios múltiples, capitalizar |
| PAC_CEDULA | cedula | String (único) | Validar formato PAN-XXXX-XXXX |
| PAC_TELEFONO | telefono | String | Normalizar a +507XXXXXXXX |
| CITA_FECHA | fecha_hora | DateTime | Convertir formato DD/MM/YYYY HH:MM a ISO 8601 |
| DOCTOR_CODIGO | doctor_id | FK | Mapear códigos RAISA a doctores en nuevo sistema |
| ESTADO | estado | Enum | Mapear tabla de estados |

---

## 11. Accesibilidad para Baja Conectividad y Bajo Alfabetismo Digital

### 11.1 Modo SMS-Only

- Sin necesidad de smartphone ni app: agendar, confirmar y cancelar citas vía SMS.
- Comandos simples:
  - `CITA [cédula]` → lista de próximas citas
  - `AGENDAR [cédula] [sucursal] [especialidad] [fecha] [hora]` → agendar
  - `CONFIRMAR [id_cita]` → confirmar
  - `CANCELAR [id_cita]` → cancelar
- Mensajes bidireccionales: respuestas estructuradas, confirmación por código PIN numérico.
- Costo de SMS absorbido por la institución (a través de contratos corporativos con operadores locales).

### 11.2 Interfaz Simplificada para Kioscos

- Pantalla táctil con iconografía grande, sin teclado físico.
- Flujo: Tocar pantalla → Seleccionar tipo de documento → Escanear/ingresar cédula → Seleccionar servicio → Imprimir turno.
- Tiempo máximo por interacción: 45 segundos.
- Sin publicidad ni distracciones visuales.
- Opción de asistente virtual por voz activable.

### 11.3 Soporte Offline Robusto

- **No es solo lectura cacheada**: el sistema debe permitir operaciones CRUD completas sin conexión.
- Cola de sincronización local (IndexedDB en web, SQLite local en kioscos).
- Priorización de sincronización: citas primero, luego datos maestros, luego logs.
- Resolución de conflictos: el servidor es autoritativo, timestamp-based.
- Indicador visual de "modo offline" + estimación de próximos eventos sincronizables.

### 11.4 Diseño para Bajo Alfabetismo Digital

- Predominancia de iconografía sobre texto (iconos universales: calendario, reloj, doctor, ubicación).
- Mínimo texto en pantallas de flujo principal.
- Instrucciones por voz opcionales (text-to-speech en kioscos y app).
- Navegación lineal (sin menús jerárquicos profundos).
- Confirmación visual + auditiva de cada acción completada.

---

## 12. Cumplimiento de Contrataciones Públicas

### 12.1 Ley de Contrataciones Públicas de Panamá

- Trazabilidad completa de licitación: cada requerimiento vinculado a su partida presupuestaria.
- Código fuente auditable: el repositorio debe estar disponible para revisión por la Contraloría si se exige.
- Transparencia en selección de proveedores de infraestructura (AWS vs. nube gubernamental).
- Documentación de arquitectura disponible en formato abierto.

### 12.2 Portal de Transparencia

- Estadísticas públicas en tiempo real:
  - Tiempo promedio de espera por sucursal
  - Citas otorgadas vs. capacidad instalada
  - Disponibilidad de agenda por especialidad
  - Tasa de cancelación y reasignación
- API pública de datos abiertos (formato JSON, CSV descargable).
- Dashboard público de rendimiento (sin datos PII).

### 12.3 Requisitos de Auditoría — Contraloría General

- Logs inmutables con sellado de tiempo (timestamping authority).
- Capacidad de exportar pistas de auditoría en formato aceptado por la Contraloría.
- Reportes trimestrales automáticos de operación del sistema.
- Integración con sistema de auditoría de la Contraloría (formato XML estándar).

### 12.4 Residencia de Datos

- Evaluación de nube gubernamental de Panamá vs. AWS internacional.
- Requisito: datos de salud deben residir en servidores dentro de Panamá (Ley 81, Decreto Ejecutivo).
- Opción: AWS Local Zone en Panamá o datacenter local certificado (si existe).
- Contrato de datos con cláusula de soberanía de datos si se usa AWS internacional (región us-east-1 con restricciones contractuales).

---

## 13. Alto Volumen y Walk-ins

### 13.1 Modelo de Atención Mixta

A diferencia del sector privado (mayormente citado), el sector público recibe un volumen masivo de pacientes sin cita previa. El sistema soporta dos modalidades simultáneas:

| Modalidad | Descripción |
|---|---|
| Cita previa | Paciente agenda con fecha/hora desde web, app o recepcionista |
| Walk-in | Paciente llega sin cita, toma turno numerado en kiosco o recepción |

### 13.2 Sistema de Turnos Numerados

- Integración con pantallas de visualización en sala de espera.
- Turno impreso con: número, especialidad, sala/consultorio.
- Llamada automática por voz ("Paciente X, pase al consultorio Y").
- Estimación de tiempo de espera en tiempo real basada en capacidad actual.

### 13.3 Priorización de Casos

| Prioridad | Tipo de Paciente | Tiempo Máximo de Espera |
|---|---|---|
| 1 (Crítica) | Urgencia vital | 0 min (derivación a emergencias) |
| 2 | Adulto mayor (65+) | 15 min |
| 3 | Embarazada | 15 min |
| 4 | Persona con discapacidad | 15 min |
| 5 | Paciente con cita previa | 10 min sobre hora agendada |
| 6 | Walk-in general | 45 min estimado |

### 13.4 Balanceo de Carga entre Sucursales

- En horas pico, el sistema sugiere al paciente (en kiosco o recepción) sucursales alternativas cercanas con menor tiempo de espera.
- Redirección asistida: el sistema emite un bono de turno válido en otra sucursal.
- Métricas en vivo de saturación por sucursal (verde/amarillo/rojo).

---

## 14. Integración con Farmacia y Dispensación CSS

### 14.1 Verificación de Disponibilidad de Medicamentos

- Antes de agendar una cita de control para paciente crónico, el sistema consulta si el medicamento recetado está disponible en la farmacia de la sucursal.
- Si el medicamento no está disponible, muestra alerta temprana al agendar y sugiere:
  - Cambiar a sucursal con disponibilidad.
  - Reprogramar para cuando llegue el lote.

### 14.2 Alertas de Desabasto

- Cuando un medicamento cae por debajo del umbral mínimo de stock, el sistema:
  - Notifica al administrador de farmacia.
  - Congela nuevas citas para pacientes que dependen de ese medicamento en esa sucursal.
  - Sugiere alternativas terapéuticas (si el doctor las configuró).

### 14.3 Registro de Dispensación

- Al entregar el medicamento, se registra en el expediente del paciente:
  - Medicamento, dosis, lote, fecha de entrega.
  - Firma digital del farmacéutico responsable.
  - Vinculación con la cita médica correspondiente (trazabilidad completa).

---

## 15. Gobernanza y Rendición de Cuentas

### 15.1 Reportes Obligatorios

| Destinatario | Reporte | Frecuencia |
|---|---|---|
| Contraloría General | Ejecución presupuestaria, citas otorgadas, tiempos de espera | Trimestral |
| AIG | Incidentes de seguridad, disponibilidad del sistema, cumplimiento normativo | Mensual |
| MINSA | Estadísticas de atención por región, indicadores de salud pública | Mensual |
| Dirección CSS | Ocupación de agenda, reasignaciones, satisfacción | Semanal |

### 15.2 Indicadores Clave de Desempeño (KPI)

| KPI | Fórmula | Meta |
|---|---|---|
| Tiempo promedio de espera | Suma(espera) / Total pacientes | < 30 min |
| Tasa de reasignación exitosa | Reasignaciones aceptadas / Reasignaciones propuestas | > 85% |
| Satisfacción del usuario | Encuestas NPS post-consulta | > 70 |
| Ocupación de agenda | Citas ocupadas / Capacidad total | 80-90% |
| Tasa de no-show | No shows / Total citas agendadas | < 10% |
| Tiempo de recuperación ante falla | Tiempo desde detección a restauración | < 2h objetivo |

### 15.3 Plan de Continuidad ante Caídas Prolongadas

Basado en la lección de la caída CSS de mayo 2026 (una semana sin servicio):
- **Modo degradado inmediato** (< 5 min): El sistema cae a modo SMS-only + kioscos offline.
- **Plan de contingencia** (< 1 h): Activación de servidor de respaldo en sitio alternativo (activo-pasivo multi-región).
- **Comunicación a usuarios**: Plantillas de mensajes pre-aprobadas para SMS y WhatsApp informando sobre la interrupción.
- **Recuperación de datos**: Sincronización de registros generados durante la caída (cola offline → servidor).
- **Simulacros trimestrales**: Prueba del plan de continuidad cada 3 meses.

---

## 16. Checklist de Pre-Lanzamiento

- [ ] pnpm audit ejecutado sin vulnerabilidades críticas/altas
- [ ] Cifrado AES-256-GCM implementado en datos sensibles en reposo
- [ ] TLS 1.3 configurado en todos los endpoints
- [ ] HSTS habilitado con `max-age=31536000; includeSubDomains; preload`
- [ ] CORS whitelist configurada sin wildcards
- [ ] Rate limiting implementado en login (5/min) y API (100/min)
- [ ] MFA obligatorio para administradores
- [ ] OWASP Top 10:2025 mitigaciones implementadas
- [ ] Sanitización de entrada en 3 capas (cliente, API, DB)
- [ ] Parameterized queries en Prisma verificadas
- [ ] DOMPurify + Helmet configurados
- [ ] AWS WAF con OWASP Core Rule Set activo
- [ ] Pruebas de penetración realizadas
- [ ] Audit trails inmutables activos y verificados
- [ ] Respaldos cifrados con rotación cada 90 días
- [ ] GDPR/HIPAA checklist completado
- [ ] **Ley 81 de Protección de Datos Personales**: Consentimiento explícito implementado
- [ ] DPO designado
- [ ] EIPD (Evaluación de Impacto de Protección de Datos) realizada
- [ ] Pruebas de disponibilidad multi-AZ: RTO < 15 min, RPO < 5 min verificados
- [ ] Zero-trust: microsegmentación activa y validada
- [ ] Snyk + Dependabot configurados en CI/CD
- [ ] Documentación de APIs actualizada
- [ ] Pruebas de carga realizadas (mínimo 1000 usuarios concurrentes)
- [ ] Plan de respuesta a incidentes documentado y socializado
- [ ] Capacitación de seguridad realizada para todo el personal
- [ ] Pruebas de reasignación inteligente de citas exitosas
- [ ] Interfaz de recepcionista validada con usuarios reales
- [ ] Flujo de agendamiento para adultos mayores probado
- [ ] Integración con MINSA SIMEPLANS verificada (consulta de historial cruzado funcional)
- [ ] Validación de identidad contra Tribunal Electoral operativa
- [ ] Verificación de estatus CSS en tiempo real probada
- [ ] Migración desde RAISA completada y validada (integridad de datos 100%)
- [ ] Período de convivencia con RAISA activo y monitoreado
- [ ] Modo SMS-only funcional (agendar, confirmar, cancelar)
- [ ] Kioscos de autoservicio desplegados y probados
- [ ] Soporte offline con cola de sincronización verificado
- [ ] Portal de transparencia publicado con datos abiertos
- [ ] Cumplimiento de Ley de Contrataciones Públicas documentado
- [ ] Logs de auditoría exportables en formato Contraloría
- [ ] Residencia de datos verificada (servidores en Panamá)
- [ ] Balanceo de carga en horas pico probado (simulación de walk-in masivo)
- [ ] Integración con farmacia/dispensación CSS operativa
- [ ] Plan de continuidad ante caídas probado en simulacro
- [ ] KPIs de rendición de cuentas configurados y visibles en dashboard

---

## 17. Conclusión Final

Este PRD describe un sistema de gestión de citas médicas diseñado específicamente para el contexto panameño del sector público, incorporando las lecciones aprendidas de los ciberataques masivos sufridos por instituciones de salud durante 2025–2026:

- **CSS**: 3 TB de datos expuestos (abril 2026)
- **MiniMed**: 400,000 registros con credenciales en texto plano (febrero 2026)
- **MINSA SIMEPLANS**: Acceso no autorizado (septiembre 2025)
- **Caída del sistema CSS**: Una semana sin servicio (mayo 2026)

El stack con **pnpm**, Next.js y NestJS sobre AWS proporciona una base moderna y escalable. La **tríada CIA** se garantiza mediante:

- **Confidencialidad**: AES-256-GCM, TLS 1.3, bcrypt/Argon2id, RBAC, zero-trust
- **Integridad**: Firmas digitales, audit trails inmutables, hash chains
- **Disponibilidad**: Multi-AZ, failover automático, RTO < 15 min, RPO < 5 min

El cumplimiento regulatorio cubre:
- **Ley 81 de Protección de Datos Personales** (consentimiento explícito, DPO, EIPD)
- **Resolución AIG** (MFA obligatorio, DMZ, pruebas de penetración anuales)
- **Decreto Ejecutivo 36 de 2026** (Comisión Nacional para Tecnologías Críticas)

Las funcionalidades de **reasignación inteligente de citas**, **gestión multi-sucursal**, y **diseño UX para adultos mayores** responden directamente a las necesidades de la población panameña, donde los adultos mayores representan una mayoría de usuarios del sistema de salud público.

El sistema busca reemplazar a **RAISA (MINSA)** y modernizar la infraestructura de citas del Estado panameño tras las lecciones de los ataques de 2025-2026. Está diseñado con un enfoque integral en:

- **Cobertura universal**: el sistema está diseñado para atender a TODOS los panameños, incluyendo comunidades indígenas, adultos mayores y personas con bajo alfabetismo digital.
- **Equidad**: priorización de casos vulnerables (adultos mayores, embarazadas, discapacidad) garantiza que los más necesitados reciban atención oportuna.
- **Continuidad**: el plan de contingencia y modo degradado SMS aseguran que el servicio nunca se detiene, incluso ante ciberataques o fallas técnicas.
- **Transparencia**: los KPIs públicos y portal de transparencia rinden cuentas a la ciudadanía.
- **Soberanía de datos**: residencia de datos en Panamá, cumpliendo la Ley 81 y el Decreto Ejecutivo 36.

> **La seguridad no es una característica — es un requisito fundamental de primer orden.**

---

## 18. Diferencias Clave vs. Variante Privada

| Dimensión | Sector Público (este documento) | Sector Privado |
|---|---|---|
| Interoperabilidad estatal | SIMEPLANS, Tribunal Electoral, CSS, RAISA | No aplica |
| Facturación y pagos | No maneja pagos (servicio gratuito) | DGI, ITBMS, Yappy, tarjetas, ACH |
| Aseguradoras | CSS (única aseguradora pública) | ASSA, Mapfre, Pan-American Life, etc. |
| Accesibilidad | SMS-only, kioscos, offline, bajo alfabetismo | App completa, telemedicina, CRM |
| Walk-ins | Volumen masivo con turnos numerados y priorización | Mayormente citado, menor volumen walk-in |
| Farmacia | Dispensación CSS con alertas de desabasto | No aplica (farmacia independiente) |
| Médicos | Empleados públicos (salario fijo) | Mixto: empleados + independientes con comisión |
| Hospitalización | No aplica (consulta externa) | Camas, quirófano, admisión hospitalaria |
| Modelo de ingresos | Presupuesto público/licitación | Suscripción/transaccional por consulta |
