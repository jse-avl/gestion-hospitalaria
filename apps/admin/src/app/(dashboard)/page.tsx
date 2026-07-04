'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@citas/ui';
import { CalendarCheck, Users, Building2, Clock, ArrowRight } from 'lucide-react';
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

  const stats = [
    { icon: CalendarCheck, label: 'Citas Hoy', value: citas.length, color: 'bg-emerald-50 text-emerald-600', href: '/citas' },
    { icon: Users, label: 'Doctores', value: doctores.length, color: 'bg-blue-50 text-blue-600', href: '/doctores' },
    { icon: Building2, label: 'Sucursales', value: sucursales.length, color: 'bg-violet-50 text-violet-600', href: '/sucursales' },
    { icon: Clock, label: 'Pendientes', value: citas.filter((c: any) => c.estado === 'PENDIENTE').length, color: 'bg-amber-50 text-amber-600', href: '/citas' },
  ];

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen del sistema de citas médicas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <a
              key={i}
              href={stat.href}
              className="group rounded-2xl border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </a>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-heading font-semibold">Citas del Día</h2>
              <p className="text-sm text-muted-foreground">Listado de citas programadas para hoy</p>
            </div>
            <CalendarCheck className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {citas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <CalendarCheck className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No hay citas para hoy</p>
            </div>
          ) : (
            <div className="space-y-3">
              {citas.map((cita: any) => (
                <div
                  key={cita.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">
                        {new Date(cita.fechaHora).toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{cita.paciente?.usuario?.nombre}</p>
                      <p className="text-sm text-muted-foreground">{cita.doctor?.usuario?.nombre} - {cita.especialidad?.nombre}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary capitalize">
                      {cita.estado?.toLowerCase()}
                    </span>
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
