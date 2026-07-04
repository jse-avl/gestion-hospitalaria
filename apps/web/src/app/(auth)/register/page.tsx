'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardContent } from '@citas/ui';
import { User, Mail, Lock, IdCard, Phone, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', cedula: '', telefono: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.auth.register(form);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      router.push('/mis-citas');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <User className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-display font-bold">Crear Cuenta</h1>
          <p className="text-muted-foreground">Regístrese como paciente</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Nombre Completo</label>
              <Input icon={<User className="h-4 w-4" />} placeholder="Juan Pérez" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <Input type="email" icon={<Mail className="h-4 w-4" />} placeholder="correo@ejemplo.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Contraseña</label>
              <Input type="password" icon={<Lock className="h-4 w-4" />} placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Cédula</label>
                <Input icon={<IdCard className="h-4 w-4" />} placeholder="8-XXX-XXXX" value={form.cedula} onChange={e => setForm({ ...form, cedula: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Teléfono</label>
                <Input icon={<Phone className="h-4 w-4" />} placeholder="+507XXXXXXXX" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
              </div>
            </div>
            {error && (
              <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Crear Cuenta <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tiene cuenta?{' '}
            <a href="/login" className="text-primary font-medium hover:underline">Inicie sesión</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}