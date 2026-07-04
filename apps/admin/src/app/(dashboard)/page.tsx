'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@citas/ui';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [citas, setCitas] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [doctores, setDoctores] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.citas.delDia().catch(() => []),
      api.sucursales.list().catch(() => []),
      api.doctores.list().catch(() => []),
    ]).then(([c, s, d]) => { setCitas(c); setSucursales(s); setDoctores(d); });
  }, []);

  return (
    <div>
      <h1 className="text-heading font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="py-6"><p className="text-2xl font-bold">{citas.length}</p><p className="text-body text-muted-foreground">Citas Hoy</p></CardContent></Card>
        <Card><CardContent className="py-6"><p className="text-2xl font-bold">{doctores.length}</p><p className="text-body text-muted-foreground">Doctores</p></CardContent></Card>
        <Card><CardContent className="py-6"><p className="text-2xl font-bold">{sucursales.length}</p><p className="text-body text-muted-foreground">Sucursales</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><h2 className="text-heading">Citas del Día</h2></CardHeader>
        <CardContent>
          {citas.length === 0 ? (
            <p className="text-body text-muted-foreground">No hay citas para hoy</p>
          ) : (
            <div className="space-y-3">
              {citas.map((cita: any) => (
                <div key={cita.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                  <div>
                    <p className="font-bold">{cita.paciente?.usuario?.nombre}</p>
                    <p className="text-sm text-muted-foreground">{cita.doctor?.usuario?.nombre} - {cita.especialidad?.nombre}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{new Date(cita.fechaHora).toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-sm">{cita.estado}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
