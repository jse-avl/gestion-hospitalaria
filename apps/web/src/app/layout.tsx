import type { Metadata } from 'next';
import '@citas/ui/globals.css';

export const metadata: Metadata = {
  title: 'Sistema de Citas Médicas',
  description: 'Agende su cita médica en línea',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  );
}