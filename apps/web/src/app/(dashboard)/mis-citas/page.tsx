'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@citas/ui';
import { CalendarPlus, CalendarCheck, Loader2, XCircle } from 'lucide-react';
import { api } from '@/lib/api';

const estadoStyles: Record<string, any> = {
  PENDIENTE: { variant: 'warning', label: 'Pendiente' },
  CONFIRMADA: { variant: 'success', label: 'Confirmada' },
  COMPLETADA: { variant: 'default', label: 'Completada' },
  CANCELADA: { variant: 'destructive', label: 'Cancelada' },
};

export default function MisCitasPage() {
  const router = useRouter();
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.citas.misCitas().then(setCitas).catch(() => router.push('/login')).finally(() => setLoading(false));
  }, [router]);

  async function handleCancelar(id: string) {
    if (!confirm('¿Está seguro de cancelar esta cita?')) return;
    try {
      await api.citas.cancelar(id);
      setCitas(citas.map(c => c.id === id ? { ...c, estado: 'CANCELADA' } : c));
    } catch {}
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <CalendarCheck className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-display font-bold">Mis Citas</h1>
            <p className="text-muted-foreground">{citas.length} cita{citas.length !== 1 ? 's' : ''} registrada{citas.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <Button onClick={() => router.push('/agendar')}>
          <CalendarPlus className="h-4 w-4" />
          Nueva Cita
        </Button>
      </div>

      {citas.length === 0 ? (
        <Card className="animate-slide-up">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <CalendarCheck className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-body text-muted-foreground mb-2">No tiene citas agendadas</p>
            <p className="text-sm text-muted-foreground mb-6">Agende su primera cita médica</p>
            <Button onClick={() => router.push('/agendar')}>Agendar Cita</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {citas.map((cita: any) => {
                  const st = estadoStyles[cita.estado] || { variant: 'default', label: cita.estado };
                  return (
                    <TableRow key={cita.id} className="animate-slide-up">
                      <TableCell className="font-medium">
                        {new Date(cita.fechaHora).toLocaleDateString('es-PA', { dateStyle: 'long' })}
                        <br />
                        <span className="text-sm text-muted-foreground">
                          {new Date(cita.fechaHora).toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </TableCell>
                      <TableCell>{cita.doctor?.usuario?.nombre}</TableCell>
                      <TableCell>{cita.especialidad?.nombre}</TableCell>
                      <TableCell>{cita.sucursal?.nombre}</TableCell>
                      <TableCell><Badge variant={st.variant as any}>{st.label}</Badge></TableCell>
                      <TableCell>
                        {cita.estado !== 'CANCELADA' && cita.estado !== 'COMPLETADA' && (
                          <Button size="sm" variant="destructive" onClick={() => handleCancelar(cita.id)}>
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Cancelar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}