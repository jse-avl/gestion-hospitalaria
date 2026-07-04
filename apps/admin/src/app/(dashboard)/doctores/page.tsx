'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@citas/ui';
import { api } from '@/lib/api';

export default function DoctoresPage() {
  const [items, setItems] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: '', email: '', especialidadId: '', sucursalId: '' });

  useEffect(() => {
    api.doctores.list().then(setItems);
    api.sucursales.list().then(setSucursales);
    api.especialidades.list().then(setEspecialidades);
  }, []);

  function resetForm() { setForm({ nombre: '', email: '', especialidadId: '', sucursalId: '' }); setEditId(null); }

  async function guardar() {
    try {
      if (editId) await api.doctores.update(editId, form);
      else await api.doctores.create(form);
      setOpen(false); resetForm();
      api.doctores.list().then(setItems);
    } catch (err: any) { alert(err.message); }
  }

  function editar(d: any) { setForm({ nombre: d.usuario?.nombre || '', email: d.usuario?.email || '', especialidadId: d.especialidadId, sucursalId: d.sucursalId }); setEditId(d.id); setOpen(true); }

  async function eliminar(id: string) { if (confirm('¿Eliminar doctor?')) { await api.doctores.delete(id); api.doctores.list().then(setItems); } }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-heading font-bold">Doctores</h1>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button onClick={() => resetForm()}>Nuevo Doctor</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Editar' : 'Nuevo'} Doctor</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <select className="flex h-12 w-full rounded-xl border border-input bg-background px-4" value={form.sucursalId} onChange={e => setForm({ ...form, sucursalId: e.target.value })}>
                <option value="">Seleccionar sucursal...</option>
                {sucursales.map((s: any) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
              <select className="flex h-12 w-full rounded-xl border border-input bg-background px-4" value={form.especialidadId} onChange={e => setForm({ ...form, especialidadId: e.target.value })}>
                <option value="">Seleccionar especialidad...</option>
                {especialidades.map((e: any) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
              <Button className="w-full" onClick={guardar}>Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Email</TableHead><TableHead>Especialidad</TableHead><TableHead>Sucursal</TableHead><TableHead>Acción</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map((d: any) => (
              <TableRow key={d.id}>
                <TableCell className="font-bold">{d.usuario?.nombre}</TableCell>
                <TableCell>{d.usuario?.email}</TableCell>
                <TableCell>{d.especialidad?.nombre}</TableCell>
                <TableCell>{d.sucursal?.nombre}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="secondary" onClick={() => editar(d)}>Editar</Button>
                    <Button size="sm" variant="destructive" onClick={() => eliminar(d.id)}>Eliminar</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}