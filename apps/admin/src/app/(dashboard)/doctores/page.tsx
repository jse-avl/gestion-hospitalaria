'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@citas/ui';
import { Users, Plus, Pencil, Trash2, Mail } from 'lucide-react';
import { api } from '@/lib/api';

export default function DoctoresPage() {
  const [items, setItems] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: '', email: '', especialidadId: '', sucursalId: '' });
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    api.doctores.list().then(setItems);
    api.sucursales.list().then(setSucursales);
    api.especialidades.list().then(setEspecialidades);
  };
  useEffect(loadData, []);

  function resetForm() { setForm({ nombre: '', email: '', especialidadId: '', sucursalId: '' }); setEditId(null); }

  async function guardar() {
    setLoading(true);
    try {
      if (editId) await api.doctores.update(editId, form);
      else await api.doctores.create(form);
      setOpen(false); resetForm();
      loadData();
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  }

  function editar(d: any) { setForm({ nombre: d.usuario?.nombre || '', email: d.usuario?.email || '', especialidadId: d.especialidadId, sucursalId: d.sucursalId }); setEditId(d.id); setOpen(true); }

  async function eliminar(id: string) { if (confirm('¿Eliminar doctor?')) { await api.doctores.delete(id); loadData(); } }

  return (
    <div className="animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Users className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-display font-bold">Doctores</h1>
            <p className="text-muted-foreground">{items.length} doctor{items.length !== 1 ? 'es' : ''} registrado{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button onClick={() => resetForm()}><Plus className="h-4 w-4" /> Nuevo Doctor</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Editar' : 'Nuevo'} Doctor</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Nombre completo" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              <Input icon={<Mail className="h-4 w-4" />} placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
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
              <Button className="w-full" onClick={guardar} loading={loading}>Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Sucursal</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((d: any) => (
                <TableRow key={d.id}>
                  <TableCell className="font-semibold">{d.usuario?.nombre}</TableCell>
                  <TableCell>{d.usuario?.email}</TableCell>
                  <TableCell>{d.especialidad?.nombre}</TableCell>
                  <TableCell>{d.sucursal?.nombre}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="secondary" onClick={() => editar(d)}>
                        <Pencil className="h-3.5 w-3.5 mr-1" />Editar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => eliminar(d.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-1" />Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No hay doctores registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}