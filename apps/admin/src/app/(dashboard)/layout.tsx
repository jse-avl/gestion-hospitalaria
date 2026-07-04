'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@citas/ui';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, CalendarCheck, Building2, Stethoscope, Users,
  UserCircle, Shield, LogOut, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/citas', label: 'Citas', icon: CalendarCheck },
  { href: '/sucursales', label: 'Sucursales', icon: Building2 },
  { href: '/especialidades', label: 'Especialidades', icon: Stethoscope },
  { href: '/doctores', label: 'Doctores', icon: Users },
  { href: '/pacientes', label: 'Pacientes', icon: UserCircle },
  { href: '/audit-logs', label: 'Auditoría', icon: Shield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);
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
    router.push('/login');
  }

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between mb-8 px-2">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <CalendarCheck className="h-5 w-5" />
          </div>
          {!collapsed && <h2 className="text-heading font-bold">Admin</h2>}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </a>
          );
        })}
      </nav>

      <div className={`border-t border-white/15 pt-4 mt-4 ${collapsed ? 'text-center' : ''}`}>
        {!collapsed && (
          <p className="text-xs text-white/60 mb-3 truncate px-2">{user?.email}</p>
        )}
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'sm'}
          className={`text-white/70 hover:text-white hover:bg-white/10 ${collapsed ? '' : 'w-full'}`}
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Cerrar Sesión</span>}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 bg-white border-b shadow-sm">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-primary" />
          <h2 className="font-bold">Admin</h2>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-primary p-4 flex flex-col shadow-dialog animate-slide-in-right">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex fixed top-0 left-0 z-30 h-screen bg-primary flex-col p-4 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}>
        {sidebarContent}
      </aside>

      {/* Main */}
      <main className={`transition-all duration-300 pt-16 lg:pt-0 ${
        collapsed ? 'lg:ml-16' : 'lg:ml-60'
      }`}>
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
