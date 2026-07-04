import type { Metadata } from 'next';
import '@citas/ui/globals.css';

export const metadata: Metadata = {
  title: 'Admin - Sistema de Citas Médicas',
  description: 'Panel de administración',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  );
}
