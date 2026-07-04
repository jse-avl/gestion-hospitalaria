'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardHeader, CardContent, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@citas/ui';
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

  useEffect(() => {
    api.citas.list().then(setCitas);
    api.sucursales.list().then(setSucursales);
    api.especialidades.list().then(setEspecialidades);
    api.doctores.list().then(setDoctores);
  }, []);

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
    try {
      await api.citas.create(form);
      setOpen(false);
      setForm({ pacienteId: '', doctorId: '', sucursalId: '', especialidadId: '', fechaHora: '', notas: '' });
      api.citas.list().then(setCitas);
    } catch (err: any) { alert(err.message); }
  }

  async function handleCheckin(id: string) {
    await api.citas.checkin(id);
    api.citas.list().then(setCitas);
  }

  async function handleCompletar(id: string) {
    await api.citas.completar(id);
    api.citas.list().then(setCitas);
  }

  async function handleCancelar(id: string) {
    if (!confirm('¿Cancelar esta cita?')) return;
    await api.citas.cancelar(id);
    api.citas.list().then(setCitas);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-heading font-bold">Citas</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button>Nueva Cita</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Crear Cita Rápida</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Buscar por cédula" value={cedulaBusqueda} onChange={e => setCedulaBusqueda(e.target.value)} />
                <Button variant="secondary" onClick={buscarPaciente}>Buscar</Button>
              </div>
              {form.pacienteId && <p className="text-sm text-green-700">Paciente encontrado ✓</p>}
              <div>
                <label className="block text-sm mb-1">Sucursal</label>
                <select className="flex h-12 w-full rounded-xl border border-input bg-background px-4" value={form.sucursalId} onChange={e => setForm({ ...form, sucursalId: e.target.value })}>
                  <option value="">Seleccionar...</option>
                  {sucursales.map((s: any) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Especialidad</label>
                <select className="flex h-12 w-full rounded-xl border border-input bg-background px-4" value={form.especialidadId} onChange={e => setForm({ ...form, especialidadId: e.target.value })}>
                  <option value="">Seleccionar...</option>
                  {especialidades.map((e: any) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Doctor</label>
                <select className="flex h-12 w-full rounded-xl border border-input bg-background px-4" value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })}>
                  <option value="">Seleccionar...</option>
                  {doctores.filter((d: any) => d.activo).map((d: any) => <option key={d.id} value={d.id}>{d.usuario?.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Fecha y Hora</label>
                <Input type="datetime-local" value={form.fechaHora} onChange={e => setForm({ ...form, fechaHora: e.target.value })} />
              </div>
              <Button className="w-full" onClick={crearCita}>Crear Cita</Button>
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
                    <TableCell>{c.paciente?.usuario?.nombre}</TableCell>
                    <TableCell>{c.doctor?.usuario?.nombre}</TableCell>
                    <TableCell>{c.especialidad?.nombre}</TableCell>
                    <TableCell>{c.sucursal?.nombre}</TableCell>
                    <TableCell>{new Date(c.fechaHora).toLocaleString('es-PA')}</TableCell>
                    <TableCell><Badge variant={st.variant as any}>{st.label}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {c.estado === 'PENDIENTE' && <Button size="sm" onClick={() => handleCheckin(c.id)}>Check-in</Button>}
                        {c.estado === 'CONFIRMADA' && <Button size="sm" onClick={() => handleCompletar(c.id)}>Completar</Button>}
                        {c.estado !== 'COMPLETADA' && c.estado !== 'CANCELADA' && <Button size="sm" variant="destructive" onClick={() => handleCancelar(c.id)}>Cancelar</Button>}
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