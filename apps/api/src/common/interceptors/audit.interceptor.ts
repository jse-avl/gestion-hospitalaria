import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path, user, ip } = request;
    const accion = `${method} ${path}`;

    return next.handle().pipe(
      tap(async (response) => {
        if (method === 'GET') return;
        try {
          await this.prisma.auditLog.create({
            data: {
              accion,
              entidad: path.split('/')[2] || 'unknown',
              usuarioId: user?.id,
              ip,
              datosNuevos: response ? JSON.parse(JSON.stringify(response)) : undefined,
            },
          });
        } catch {}
      }),
    );
  }
}