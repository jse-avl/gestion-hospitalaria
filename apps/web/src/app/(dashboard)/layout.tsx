'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@citas/ui';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch { router.push('/login'); }
  }, [router]);

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/');
  }

  return (
    <div className="min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <h2 className="text-heading font-bold">Sistema de Citas</h2>
        <nav className="flex gap-4 items-center">
          <a href="/mis-citas" className="underline">Mis Citas</a>
          <a href="/agendar" className="underline">Agendar Cita</a>
          <a href="/perfil" className="underline">Perfil</a>
          <Button variant="secondary" size="sm" onClick={logout}>Salir</Button>
        </nav>
      </header>
      <main className="p-6 max-w-4xl mx-auto">{children}</main>
    </div>
  );
}