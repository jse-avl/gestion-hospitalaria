'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardHeader, CardContent, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@citas/ui';
import { CalendarCheck, Plus, Search, UserCheck, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

const estadoStyles: Record<string, any> = {
  PENDIENTE: { variant: 'warning', label: 'Pendiente' },
  CONFIRMADA: { variant: 'success', label: 'Confirmada' },
  COMPLETADA: { variant: 'default', label: 'Completada' },
  CANCELADA: { variant: 'destructive', label: 'Cancelada' },
};

export default function CitasPage() {
  const [citas, setCitas] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [doctores, setDoctores] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ pacienteId: '', doctorId: '', sucursalId: '', especialidadId: '', fechaHora: '', notas: '' });
  const [cedulaBusqueda, setCedulaBusqueda] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    api.citas.list().then(setCitas);
    api.sucursales.list().then(setSucursales);
    api.especialidades.list().then(setEspecialidades);
    api.doctores.list().then(setDoctores);
  };

  useEffect(loadData, []);

  useEffect(() => {
    if (form.sucursalId && form.especialidadId) {
      api.doctores.list().then(all => setDoctores(all.filter((d: any) => d.sucursalId === form.sucursalId && d.especialidadId === form.especialidadId)));
    }
  }, [form.sucursalId, form.especialidadId]);

  async function buscarPaciente() {
    if (!cedulaBusqueda) return;
    const pac = await api.pacientes.buscar(cedulaBusqueda);
    if (pac) setForm({ ...form, pacienteId: pac.id });
    else alert('Paciente no encontrado');
  }

  async function crearCita() {
    setLoading(true);
    try {
      await api.citas.create(form);
      setOpen(false);
      setForm({ pacienteId: '', doctorId: '', sucursalId: '', especialidadId: '', fechaHora: '', notas: '' });
      loadData();
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  }

  async function handleCheckin(id: string) { await api.citas.checkin(id); loadData(); }
  async function handleCompletar(id: string) { await api.citas.completar(id); loadData(); }
  async function handleCancelar(id: string) {
    if (!confirm('¿Cancelar esta cita?')) return;
    await api.citas.cancelar(id);
    loadData();
  }

  return (
    <div className="animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <CalendarCheck className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-display font-bold">Citas</h1>
            <p className="text-muted-foreground">{citas.length} cita{citas.length !== 1 ? 's' : ''} registrada{citas.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4" /> Nueva Cita</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Crear Cita Rápida</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input icon={<Search className="h-4 w-4" />} placeholder="Buscar por cédula" value={cedulaBusqueda} onChange={e => setCedulaBusqueda(e.target.value)} />
                <Button variant="secondary" onClick={buscarPaciente}>Buscar</Button>
              </div>
              {form.pacienteId && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700 flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Paciente encontrado
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1.5">Sucursal</label>
                <Select value={form.sucursalId} onValueChange={v => setForm({ ...form, sucursalId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar sucursal..." /></SelectTrigger>
                  <SelectContent>
                    {sucursales.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Especialidad</label>
                <Select value={form.especialidadId} onValueChange={v => setForm({ ...form, especialidadId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar especialidad..." /></SelectTrigger>
                  <SelectContent>
                    {especialidades.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Doctor</label>
                <Select value={form.doctorId} onValueChange={v => setForm({ ...form, doctorId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar doctor..." /></SelectTrigger>
                  <SelectContent>
                    {doctores.filter((d: any) => d.activo).map((d: any) => <SelectItem key={d.id} value={d.id}>{d.usuario?.nombre}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Fecha y Hora</label>
                <Input type="datetime-local" value={form.fechaHora} onChange={e => setForm({ ...form, fechaHora: e.target.value })} />
              </div>
              <Button className="w-full" onClick={crearCita} loading={loading}>Crear Cita</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead><TableHead>Doctor</TableHead><TableHead>Especialidad</TableHead>
                <TableHead>Sucursal</TableHead><TableHead>Fecha</TableHead><TableHead>Estado</TableHead><TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citas.map((c: any) => {
                const st = estadoStyles[c.estado] || { variant: 'default', label: c.estado };
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.paciente?.usuario?.nombre}</TableCell>
                    <TableCell>{c.doctor?.usuario?.nombre}</TableCell>
                    <TableCell>{c.especialidad?.nombre}</TableCell>
                    <TableCell>{c.sucursal?.nombre}</TableCell>
                    <TableCell>{new Date(c.fechaHora).toLocaleString('es-PA')}</TableCell>
                    <TableCell><Badge variant={st.variant as any}>{st.label}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {c.estado === 'PENDIENTE' && <Button size="sm" onClick={() => handleCheckin(c.id)}><UserCheck className="h-3.5 w-3.5 mr-1" />Check-in</Button>}
                        {c.estado === 'CONFIRMADA' && <Button size="sm" onClick={() => handleCompletar(c.id)}><CheckCircle2 className="h-3.5 w-3.5 mr-1" />Completar</Button>}
                        {c.estado !== 'COMPLETADA' && c.estado !== 'CANCELADA' && <Button size="sm" variant="destructive" onClick={() => handleCancelar(c.id)}><XCircle className="h-3.5 w-3.5 mr-1" />Cancelar</Button>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}