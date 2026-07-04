'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@citas/ui';
import { useEffect, useState } from 'react';
import { CalendarCheck, CalendarPlus, User, LogOut, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/mis-citas', label: 'Mis Citas', icon: CalendarCheck },
  { href: '/agendar', label: 'Agendar Cita', icon: CalendarPlus },
  { href: '/perfil', label: 'Perfil', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <CalendarCheck className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-heading font-bold text-foreground">Mi Salud</h2>
            </div>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </a>
                );
              })}
              <div className="ml-4 flex items-center gap-3 pl-4 border-l">
                <span className="text-sm text-muted-foreground">{user?.email}</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Salir
                </Button>
              </div>
            </nav>

            {/* Mobile menu button */}
            <button
              className="sm:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="sm:hidden border-t bg-white px-4 py-3 animate-slide-up">
            <nav className="flex flex-col gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </a>
                );
              })}
              <hr className="my-2" />
              <span className="px-4 text-sm text-muted-foreground">{user?.email}</span>
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}