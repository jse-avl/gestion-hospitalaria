'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@citas/ui';

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-display font-bold mb-4">Sistema de Citas Médicas</h1>
      <p className="text-body text-muted-foreground mb-8 max-w-md">
        Agende, reprograme o cancele sus citas médicas de forma rápida y sencilla.
      </p>
      <div className="flex gap-4">
        <Button size="lg" onClick={() => router.push('/login')}>Iniciar Sesión</Button>
        <Button size="lg" variant="outline" onClick={() => router.push('/register')}>Registrarse</Button>
      </div>
    </div>
  );
}