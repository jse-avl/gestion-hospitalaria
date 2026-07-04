'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardHeader, CardContent } from '@citas/ui';
import { Building2, Stethoscope, CalendarDays, CheckCircle2, ArrowLeft, ChevronRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

const stepConfig = [
  { icon: Building2, title: 'Sucursal' },
  { icon: Stethoscope, title: 'Especialidad' },
  { icon: CalendarDays, title: 'Fecha y Doctor' },
  { icon: CheckCircle2, title: 'Confirmar' },
];

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
      <div className="flex items-center justify-center min-h-[60vh] animate-scale-in">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="text-display font-bold mb-3">Cita Agendada</h2>
            <p className="text-muted-foreground mb-8">Recibirá una notificación de confirmación en su correo.</p>
            <Button size="lg" onClick={() => router.push('/mis-citas')}>Ver Mis Citas</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <CalendarDays className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-display font-bold">Agendar Cita</h1>
          <p className="text-muted-foreground">Siga los pasos para agendar su cita médica</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          {stepConfig.map((s, i) => {
            const StepIcon = s.icon;
            const isActive = step > i + 1;
            const isCurrent = step === i + 1;
            return (
              <div key={i} className="flex items-center flex-1">
                <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isCurrent ? 'bg-primary/10 text-primary' :
                  isActive ? 'bg-primary text-primary-foreground' :
                  'text-muted-foreground'
                }`}>
                  <StepIcon className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
                  <span className="hidden sm:inline">{s.title}</span>
                </div>
                {i < stepConfig.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300 ${
                    step > i + 1 ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {step === 1 && (
        <Card className="animate-slide-up">
          <CardHeader>
            <h2 className="text-heading font-semibold">Seleccione la Sucursal</h2>
            <p className="text-muted-foreground text-sm">Elija la sucursal de su preferencia</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {sucursales.map((s: any) => (
              <button
                key={s.id}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  selected.sucursalId === s.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30 hover:bg-muted/50'
                }`}
                onClick={() => { setSelected({ ...selected, sucursalId: s.id }); setStep(2); }}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    selected.sucursalId === s.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{s.nombre}</div>
                    <div className="text-sm text-muted-foreground">{s.direccion}</div>
                  </div>
                  <ChevronRight className={`h-5 w-5 ${
                    selected.sucursalId === s.id ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="animate-slide-up">
          <CardHeader>
            <h2 className="text-heading font-semibold">Seleccione la Especialidad</h2>
            <p className="text-muted-foreground text-sm">Elija la especialidad médica que necesita</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {especialidades.map((e: any) => (
              <button
                key={e.id}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  selected.especialidadId === e.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30 hover:bg-muted/50'
                }`}
                onClick={() => { setSelected({ ...selected, especialidadId: e.id }); setStep(3); }}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    selected.especialidadId === e.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{e.nombre}</div>
                    <div className="text-sm text-muted-foreground">{e.descripcion}</div>
                  </div>
                  <ChevronRight className={`h-5 w-5 ${
                    selected.especialidadId === e.id ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>
              </button>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Atrás
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="animate-slide-up">
          <CardHeader>
            <h2 className="text-heading font-semibold">Seleccione Fecha y Doctor</h2>
            <p className="text-muted-foreground text-sm">Escoja una fecha y un doctor disponible</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Fecha de la cita</label>
              <input
                type="date"
                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-body ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
              />
            </div>
            {fecha && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Doctores disponibles</h3>
                {doctores.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground rounded-xl bg-muted/50">
                    No hay doctores disponibles para esta fecha
                  </div>
                ) : (
                  doctores.map((d: any) => (
                    <button
                      key={d.id}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        selected.doctorId === d.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30 hover:bg-muted/50'
                      }`}
                      onClick={() => { setSelected({ ...selected, doctorId: d.id, pacienteId: d.pacienteId || selected.pacienteId }); setStep(4); }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          selected.doctorId === d.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Stethoscope className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{d.usuario?.nombre}</div>
                          <div className="text-sm text-muted-foreground">
                            {d.citasDelDia?.length || 0} citas agendadas este día
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 ${
                          selected.doctorId === d.id ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Atrás
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="animate-slide-up">
          <CardHeader>
            <h2 className="text-heading font-semibold">Confirmar Cita</h2>
            <p className="text-muted-foreground text-sm">Revise los datos antes de confirmar</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {[
                { icon: Building2, label: 'Sucursal', value: sucursales.find(s => s.id === selected.sucursalId)?.nombre },
                { icon: Stethoscope, label: 'Especialidad', value: especialidades.find(e => e.id === selected.especialidadId)?.nombre },
                { icon: CalendarDays, label: 'Doctor', value: doctores.find((d: any) => d.id === selected.doctorId)?.usuario?.nombre },
                { icon: CalendarDays, label: 'Fecha', value: new Date(fecha).toLocaleDateString('es-PA', { dateStyle: 'full' }) },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Atrás
              </Button>
              <Button className="flex-1" onClick={confirmarCita} loading={loading}>
                {loading ? 'Confirmando...' : 'Confirmar Cita'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}