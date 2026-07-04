import type { Metadata } from 'next';
import '@citas/ui/globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Sistema de Citas Médicas',
  description: 'Agende su cita médica en línea',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background">
        {children}
        <Toaster
          richColors
          closeButton
          position="top-right"
          toastOptions={{
            style: { borderRadius: '0.75rem', padding: '1rem' },
          }}
        />
      </body>
    </html>
  );
}