'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@citas/ui';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/citas', label: 'Citas', icon: '📅' },
  { href: '/sucursales', label: 'Sucursales', icon: '🏥' },
  { href: '/especialidades', label: 'Especialidades', icon: '🩺' },
  { href: '/doctores', label: 'Doctores', icon: '👨‍⚕️' },
  { href: '/pacientes', label: 'Pacientes', icon: '👤' },
  { href: '/audit-logs', label: 'Auditoría', icon: '📋' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
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
    router.push('/login');
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-primary text-primary-foreground p-4 flex flex-col">
        <h2 className="text-heading font-bold mb-6">Admin</h2>
        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={"flex items-center gap-3 px-4 py-3 rounded-xl text-body transition-colors " + (pathname === item.href ? 'bg-white/20' : 'hover:bg-white/10')}
            >
              <span>{item.icon}</span> {item.label}
            </a>
          ))}
        </nav>
        <div className="border-t border-white/20 pt-4 mt-4">
          <p className="text-sm mb-2">{user?.email}</p>
          <Button variant="secondary" size="sm" className="w-full" onClick={logout}>Cerrar Sesión</Button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
