'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@citas/ui';
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: '', direccion: '', telefono: '' });
  const [loading, setLoading] = useState(false);

  const loadData = () => api.sucursales.list().then(setSucursales);
  useEffect(loadData, []);

  function resetForm() { setForm({ nombre: '', direccion: '', telefono: '' }); setEditId(null); }

  async function guardar() {
    setLoading(true);
    try {
      if (editId) await api.sucursales.update(editId, form);
      else await api.sucursales.create(form);
      setOpen(false); resetForm();
      loadData();
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  }

  function editar(s: any) { setForm({ nombre: s.nombre, direccion: s.direccion, telefono: s.telefono || '' }); setEditId(s.id); setOpen(true); }

  async function eliminar(id: string) { if (confirm('¿Eliminar sucursal?')) { await api.sucursales.delete(id); loadData(); } }

  return (
    <div className="animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-display font-bold">Sucursales</h1>
            <p className="text-muted-foreground">{sucursales.length} sucursal{sucursales.length !== 1 ? 'es' : ''} registrada{sucursales.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button onClick={() => resetForm()}><Plus className="h-4 w-4" /> Nueva Sucursal</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Editar' : 'Nueva'} Sucursal</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Nombre de la sucursal" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              <Input placeholder="Dirección" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
              <Input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
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
                <TableHead>Dirección</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sucursales.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell className="font-semibold">{s.nombre}</TableCell>
                  <TableCell>{s.direccion}</TableCell>
                  <TableCell>{s.telefono}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="secondary" onClick={() => editar(s)}>
                        <Pencil className="h-3.5 w-3.5 mr-1" />Editar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => eliminar(s.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-1" />Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {sucursales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    No hay sucursales registradas
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