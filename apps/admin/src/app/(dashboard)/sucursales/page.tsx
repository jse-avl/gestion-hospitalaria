'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@citas/ui';
import { api } from '@/lib/api';

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: '', direccion: '', telefono: '' });

  useEffect(() => { api.sucursales.list().then(setSucursales); }, []);

  function resetForm() { setForm({ nombre: '', direccion: '', telefono: '' }); setEditId(null); }

  async function guardar() {
    if (editId) await api.sucursales.update(editId, form);
    else await api.sucursales.create(form);
    setOpen(false); resetForm();
    api.sucursales.list().then(setSucursales);
  }

  function editar(s: any) { setForm({ nombre: s.nombre, direccion: s.direccion, telefono: s.telefono || '' }); setEditId(s.id); setOpen(true); }

  async function eliminar(id: string) { if (confirm('¿Eliminar sucursal?')) { await api.sucursales.delete(id); api.sucursales.list().then(setSucursales); } }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-heading font-bold">Sucursales</h1>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button onClick={() => resetForm()}>Nueva Sucursal</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Editar' : 'Nueva'} Sucursal</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              <Input placeholder="Dirección" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
              <Input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
              <Button className="w-full" onClick={guardar}>Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Dirección</TableHead><TableHead>Teléfono</TableHead><TableHead>Acción</TableHead></TableRow></TableHeader>
          <TableBody>
            {sucursales.map((s: any) => (
              <TableRow key={s.id}>
                <TableCell className="font-bold">{s.nombre}</TableCell>
                <TableCell>{s.direccion}</TableCell>
                <TableCell>{s.telefono}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="secondary" onClick={() => editar(s)}>Editar</Button>
                    <Button size="sm" variant="destructive" onClick={() => eliminar(s.id)}>Eliminar</Button>
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