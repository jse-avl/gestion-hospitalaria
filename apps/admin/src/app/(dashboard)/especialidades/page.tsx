'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@citas/ui';
import { api } from '@/lib/api';

export default function EspecialidadesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', cupoMaximo: 20 });

  useEffect(() => { api.especialidades.list().then(setItems); }, []);

  function resetForm() { setForm({ nombre: '', descripcion: '', cupoMaximo: 20 }); setEditId(null); }

  async function guardar() {
    if (editId) await api.especialidades.update(editId, form);
    else await api.especialidades.create(form);
    setOpen(false); resetForm();
    api.especialidades.list().then(setItems);
  }

  function editar(e: any) { setForm({ nombre: e.nombre, descripcion: e.descripcion || '', cupoMaximo: e.cupoMaximo }); setEditId(e.id); setOpen(true); }

  async function eliminar(id: string) { if (confirm('¿Eliminar?')) { await api.especialidades.delete(id); api.especialidades.list().then(setItems); } }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-heading font-bold">Especialidades</h1>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button onClick={() => resetForm()}>Nueva Especialidad</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Editar' : 'Nueva'} Especialidad</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              <Input placeholder="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
              <Input type="number" placeholder="Cupo máximo" value={form.cupoMaximo} onChange={e => setForm({ ...form, cupoMaximo: parseInt(e.target.value) || 20 })} />
              <Button className="w-full" onClick={guardar}>Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Descripción</TableHead><TableHead>Cupo</TableHead><TableHead>Acción</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map((e: any) => (
              <TableRow key={e.id}>
                <TableCell className="font-bold">{e.nombre}</TableCell>
                <TableCell>{e.descripcion}</TableCell>
                <TableCell>{e.cupoMaximo}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="secondary" onClick={() => editar(e)}>Editar</Button>
                    <Button size="sm" variant="destructive" onClick={() => eliminar(e.id)}>Eliminar</Button>
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