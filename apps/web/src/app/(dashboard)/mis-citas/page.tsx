'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@citas/ui';
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

  if (loading) return <p className="text-body">Cargando...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-heading font-bold">Mis Citas</h1>
        <Button onClick={() => router.push('/agendar')}>Nueva Cita</Button>
      </div>

      {citas.length === 0 ? (
        <Card><CardContent className="text-center py-8"><p className="text-body text-muted-foreground">No tiene citas agendadas</p></CardContent></Card>
      ) : (
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
                <TableRow key={cita.id}>
                  <TableCell>{new Date(cita.fechaHora).toLocaleDateString('es-PA', { dateStyle: 'full' })} {new Date(cita.fechaHora).toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  <TableCell>{cita.doctor?.usuario?.nombre}</TableCell>
                  <TableCell>{cita.especialidad?.nombre}</TableCell>
                  <TableCell>{cita.sucursal?.nombre}</TableCell>
                  <TableCell><Badge variant={st.variant as any}>{st.label}</Badge></TableCell>
                  <TableCell>
                    {cita.estado !== 'CANCELADA' && cita.estado !== 'COMPLETADA' && (
                      <Button size="sm" variant="destructive" onClick={() => handleCancelar(cita.id)}>Cancelar</Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}