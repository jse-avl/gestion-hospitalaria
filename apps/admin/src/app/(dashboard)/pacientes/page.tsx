'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@citas/ui';
import { api } from '@/lib/api';

export default function PacientesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', cedula: '', telefono: '' });

  useEffect(() => { api.pacientes.list().then(setItems); }, []);

  async function buscar() {
    if (!busqueda) { api.pacientes.list().then(setItems); return; }
    const pac = await api.pacientes.buscar(busqueda);
    setItems(pac ? [pac] : []);
  }

  async function guardar() {
    try {
      await api.pacientes.create(form);
      setOpen(false);
      setForm({ nombre: '', email: '', cedula: '', telefono: '' });
      api.pacientes.list().then(setItems);
    } catch (err: any) { alert(err.message); }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-heading font-bold">Pacientes</h1>
        <div className="flex gap-2">
          <Input placeholder="Buscar por cédula..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-64" />
          <Button variant="secondary" onClick={buscar}>Buscar</Button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button>Nuevo Paciente</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo Paciente</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Cédula" value={form.cedula} onChange={e => setForm({ ...form, cedula: e.target.value })} />
              <Input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
              <Button className="w-full" onClick={guardar}>Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Email</TableHead><TableHead>Cédula</TableHead><TableHead>Teléfono</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="font-bold">{p.usuario?.nombre}</TableCell>
                <TableCell>{p.usuario?.email}</TableCell>
                <TableCell>{p.cedula}</TableCell>
                <TableCell>{p.telefono}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}