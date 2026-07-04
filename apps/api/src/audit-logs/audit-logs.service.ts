import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 50, entidad?: string) {
    const where = entidad ? { entidad } : {};
    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: { usuario: { select: { id: true, nombre: true, email: true, rol: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
