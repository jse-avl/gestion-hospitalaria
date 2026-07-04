'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@citas/ui';
import { api } from '@/lib/api';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ page: 1, totalPages: 1 });
  const [entidad, setEntidad] = useState('');

  useEffect(() => { cargar(); }, [meta.page, entidad]);

  async function cargar() {
    const res = await api.auditLogs.list({ page: meta.page, limit: 50, entidad: entidad || undefined });
    setLogs(res.data);
    setMeta(res.meta);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-heading font-bold">Auditoría</h1>
        <select
          className="flex h-12 rounded-xl border border-input bg-background px-4"
          value={entidad}
          onChange={e => { setEntidad(e.target.value); setMeta({ ...meta, page: 1 }); }}
        >
          <option value="">Todas las entidades</option>
          <option value="sucursales">Sucursales</option>
          <option value="especialidades">Especialidades</option>
          <option value="doctores">Doctores</option>
          <option value="pacientes">Pacientes</option>
          <option value="citas">Citas</option>
          <option value="auth">Autenticación</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">{new Date(log.createdAt).toLocaleString('es-PA')}</TableCell>
                  <TableCell><code className="bg-muted px-2 py-1 rounded text-sm">{log.accion}</code></TableCell>
                  <TableCell>{log.entidad}</TableCell>
                  <TableCell>{log.usuario?.nombre || log.usuario?.email || '-'}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ip || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            className="px-4 py-2 rounded-xl border disabled:opacity-50"
            disabled={meta.page <= 1}
            onClick={() => setMeta({ ...meta, page: meta.page - 1 })}
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-body">
            Página {meta.page} de {meta.totalPages}
          </span>
          <button
            className="px-4 py-2 rounded-xl border disabled:opacity-50"
            disabled={meta.page >= meta.totalPages}
            onClick={() => setMeta({ ...meta, page: meta.page + 1 })}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
