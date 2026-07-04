'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@citas/ui';
import { Stethoscope, Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function EspecialidadesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', cupoMaximo: 20 });
  const [loading, setLoading] = useState(false);

  const loadData = () => api.especialidades.list().then(setItems);
  useEffect(loadData, []);

  function resetForm() { setForm({ nombre: '', descripcion: '', cupoMaximo: 20 }); setEditId(null); }

  async function guardar() {
    setLoading(true);
    try {
      if (editId) await api.especialidades.update(editId, form);
      else await api.especialidades.create(form);
      setOpen(false); resetForm();
      loadData();
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  }

  function editar(e: any) { setForm({ nombre: e.nombre, descripcion: e.descripcion || '', cupoMaximo: e.cupoMaximo }); setEditId(e.id); setOpen(true); }

  async function eliminar(id: string) { if (confirm('¿Eliminar?')) { await api.especialidades.delete(id); loadData(); } }

  return (
    <div className="animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Stethoscope className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-display font-bold">Especialidades</h1>
            <p className="text-muted-foreground">{items.length} especialidad{items.length !== 1 ? 'es' : ''} registrada{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button onClick={() => resetForm()}><Plus className="h-4 w-4" /> Nueva Especialidad</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Editar' : 'Nueva'} Especialidad</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Nombre de la especialidad" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              <Input placeholder="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
              <Input type="number" placeholder="Cupo máximo por día" value={form.cupoMaximo} onChange={e => setForm({ ...form, cupoMaximo: parseInt(e.target.value) || 20 })} />
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
                <TableHead>Descripción</TableHead>
                <TableHead>Cupo Máximo</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((e: any) => (
                <TableRow key={e.id}>
                  <TableCell className="font-semibold">{e.nombre}</TableCell>
                  <TableCell>{e.descripcion || '-'}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center rounded-lg bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                      {e.cupoMaximo}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="secondary" onClick={() => editar(e)}>
                        <Pencil className="h-3.5 w-3.5 mr-1" />Editar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => eliminar(e.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-1" />Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    No hay especialidades registradas
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