'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@citas/ui';
import { User, Mail, Shield, Loader2 } from 'lucide-react';

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch { router.push('/login'); }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-display font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">Información de su cuenta</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rol</p>
              <p className="font-medium capitalize">{user?.rol?.toLowerCase()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}