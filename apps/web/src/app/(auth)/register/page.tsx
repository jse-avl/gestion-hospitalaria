'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardContent } from '@citas/ui';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', cedula: '', telefono: '' });
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const data = await api.auth.register(form);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      router.push('/mis-citas');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader><h1 className="text-heading font-bold">Registrarse</h1></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-body mb-1">Nombre Completo</label>
              <Input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div>
              <label className="block text-body mb-1">Email</label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-body mb-1">Contraseña</label>
              <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
            <div>
              <label className="block text-body mb-1">Cédula</label>
              <Input value={form.cedula} onChange={e => setForm({ ...form, cedula: e.target.value })} placeholder="8-XXX-XXXX" />
            </div>
            <div>
              <label className="block text-body mb-1">Teléfono</label>
              <Input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="+507XXXXXXXX" />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full">Registrarse</Button>
          </form>
          <p className="mt-4 text-center text-sm">
            ¿Ya tiene cuenta? <a href="/login" className="text-primary underline">Inicie sesión</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}