'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@citas/ui';
import { UserCircle, Plus, Search, Mail, IdCard, Phone, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function PacientesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', cedula: '', telefono: '' });
  const [loading, setLoading] = useState(false);

  const loadData = () => api.pacientes.list().then(setItems);
  useEffect(loadData, []);

  async function buscar() {
    if (!busqueda) { loadData(); return; }
    const pac = await api.pacientes.buscar(busqueda);
    setItems(pac ? [pac] : []);
  }

  async function guardar() {
    setLoading(true);
    try {
      await api.pacientes.create(form);
      setOpen(false);
      setForm({ nombre: '', email: '', cedula: '', telefono: '' });
      loadData();
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <UserCircle className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-display font-bold">Pacientes</h1>
            <p className="text-muted-foreground">{items.length} paciente{items.length !== 1 ? 's' : ''} registrado{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Input icon={<Search className="h-4 w-4" />} placeholder="Buscar por cédula..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-56" onKeyDown={e => e.key === 'Enter' && buscar()} />
          <Button variant="secondary" onClick={buscar}>Buscar</Button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4" /> Nuevo Paciente</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo Paciente</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Nombre completo" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              <Input icon={<Mail className="h-4 w-4" />} placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <Input icon={<IdCard className="h-4 w-4" />} placeholder="Cédula" value={form.cedula} onChange={e => setForm({ ...form, cedula: e.target.value })} />
              <Input icon={<Phone className="h-4 w-4" />} placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
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
                <TableHead>Cédula</TableHead>
                <TableHead>Teléfono</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-semibold">{p.usuario?.nombre}</TableCell>
                  <TableCell>{p.usuario?.email}</TableCell>
                  <TableCell className="font-mono text-sm">{p.cedula}</TableCell>
                  <TableCell>{p.telefono}</TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    No hay pacientes registrados
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