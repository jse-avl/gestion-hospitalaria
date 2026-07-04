'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardHeader, CardContent } from '@citas/ui';
import { api } from '@/lib/api';

export default function AgendarPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [doctores, setDoctores] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [fecha, setFecha] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { api.sucursales.list().then(setSucursales); }, []);
  useEffect(() => { api.especialidades.list().then(setEspecialidades); }, []);

  useEffect(() => {
    if (selected.sucursalId && selected.especialidadId && fecha) {
      api.doctores.disponibles({ sucursalId: selected.sucursalId, especialidadId: selected.especialidadId, fecha })
        .then(setDoctores);
    }
  }, [selected.sucursalId, selected.especialidadId, fecha]);

  async function confirmarCita() {
    setLoading(true);
    try {
      await api.citas.create({
        pacienteId: selected.pacienteId,
        doctorId: selected.doctorId,
        sucursalId: selected.sucursalId,
        especialidadId: selected.especialidadId,
        fechaHora: selected.fechaHora,
      });
      setSuccess(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card><CardContent className="text-center py-12">
        <h2 className="text-heading font-bold mb-4">Cita Agendada Exitosamente</h2>
        <p className="text-body mb-6">Recibirá una notificación de confirmación.</p>
        <Button onClick={() => router.push('/mis-citas')}>Ver Mis Citas</Button>
      </CardContent></Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-heading font-bold mb-6">Agendar Cita</h1>

      {/* Progress indicator */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader><h2 className="text-heading">Seleccione la Sucursal</h2></CardHeader>
          <CardContent className="space-y-3">
            {sucursales.map((s: any) => (
              <Button key={s.id} variant={selected.sucursalId === s.id ? 'default' : 'outline'} className="w-full justify-start h-auto py-4" onClick={() => { setSelected({ ...selected, sucursalId: s.id }); setStep(2); }}>
                <div className="text-left"><div className="font-bold">{s.nombre}</div><div className="text-sm opacity-80">{s.direccion}</div></div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader><h2 className="text-heading">Seleccione la Especialidad</h2></CardHeader>
          <CardContent className="space-y-3">
            {especialidades.map((e: any) => (
              <Button key={e.id} variant={selected.especialidadId === e.id ? 'default' : 'outline'} className="w-full justify-start h-auto py-4" onClick={() => { setSelected({ ...selected, especialidadId: e.id }); setStep(3); }}>
                {e.nombre}
              </Button>
            ))}
            <Button variant="ghost" onClick={() => setStep(1)}>Atrás</Button>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader><h2 className="text-heading">Seleccione Fecha y Doctor</h2></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-body mb-1">Fecha</label>
              <input type="date" className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-body" value={fecha} onChange={e => setFecha(e.target.value)} />
            </div>
            {fecha && (
              <div className="space-y-3">
                {doctores.map((d: any) => (
                  <Button key={d.id} variant={selected.doctorId === d.id ? 'default' : 'outline'} className="w-full justify-start h-auto py-4" onClick={() => { setSelected({ ...selected, doctorId: d.id, pacienteId: d.pacienteId || selected.pacienteId }); setStep(4); }}>
                    <div className="text-left"><div className="font-bold">{d.usuario?.nombre}</div><div className="text-sm opacity-80">{d.citasDelDia?.length || 0} citas agendadas</div></div>
                  </Button>
                ))}
              </div>
            )}
            <Button variant="ghost" onClick={() => setStep(2)}>Atrás</Button>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader><h2 className="text-heading">Confirmar Cita</h2></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-body">Revise los datos de su cita:</p>
            <div className="bg-muted p-4 rounded-xl space-y-2">
              <p><strong>Sucursal:</strong> {sucursales.find(s => s.id === selected.sucursalId)?.nombre}</p>
              <p><strong>Especialidad:</strong> {especialidades.find(e => e.id === selected.especialidadId)?.nombre}</p>
              <p><strong>Doctor:</strong> {doctores.find((d: any) => d.id === selected.doctorId)?.usuario?.nombre}</p>
              <p><strong>Fecha:</strong> {fecha}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)}>Atrás</Button>
              <Button onClick={confirmarCita} disabled={loading}>{loading ? 'Confirmando...' : 'Confirmar Cita'}</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}