'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@citas/ui';

export default function PerfilPage() {
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

  return (
    <div>
      <h1 className="text-heading font-bold mb-6">Mi Perfil</h1>
      <Card>
        <CardContent className="space-y-4 py-6">
          <div><strong>Email:</strong> <span className="text-body">{user?.email}</span></div>
          <div><strong>Rol:</strong> <span className="text-body">{user?.rol}</span></div>
        </CardContent>
      </Card>
    </div>
  );
}