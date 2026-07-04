'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@citas/ui';
import { Shield, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { api } from '@/lib/api';

const entidades = [
  { value: '', label: 'Todas las entidades' },
  { value: 'sucursales', label: 'Sucursales' },
  { value: 'especialidades', label: 'Especialidades' },
  { value: 'doctores', label: 'Doctores' },
  { value: 'pacientes', label: 'Pacientes' },
  { value: 'citas', label: 'Citas' },
  { value: 'auth', label: 'Autenticación' },
];

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
    <div className="animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-display font-bold">Auditoría</h1>
            <p className="text-muted-foreground">Registro de eventos del sistema</p>
          </div>
        </div>
        <div className="w-56">
          <Select value={entidad} onValueChange={v => { setEntidad(v); setMeta({ ...meta, page: 1 }); }}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por entidad" />
            </SelectTrigger>
            <SelectContent>
              {entidades.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
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
                  <TableCell className="text-sm whitespace-nowrap">{new Date(log.createdAt).toLocaleString('es-PA')}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-0.5 text-xs font-mono font-medium">
                      {log.accion}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">{log.entidad}</TableCell>
                  <TableCell>{log.usuario?.nombre || log.usuario?.email || '-'}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{log.ip || '-'}</TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <Search className="h-5 w-5 mx-auto mb-2 opacity-50" />
                    No hay registros de auditoría
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page <= 1}
            onClick={() => setMeta({ ...meta, page: meta.page - 1 })}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {meta.page} de {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page >= meta.totalPages}
            onClick={() => setMeta({ ...meta, page: meta.page + 1 })}
          >
            Siguiente <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
