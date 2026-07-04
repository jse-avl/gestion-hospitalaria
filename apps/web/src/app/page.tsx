'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@citas/ui';
import { CalendarCheck, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

const features = [
  { icon: CalendarCheck, title: 'Agende en Línea', desc: 'Reserve su cita desde cualquier lugar, sin llamadas ni esperas.' },
  { icon: Clock, title: 'Gestión de Tiempo', desc: 'Reciba recordatorios y gestione sus citas de forma eficiente.' },
  { icon: ShieldCheck, title: 'Datos Seguros', desc: 'Su información médica protegida con los más altos estándares.' },
];

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-emerald-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Plataforma de Salud Digital
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Sistema de Citas Médicas
            </h1>
            <p className="mt-6 text-lg text-white/80">
              Agende, reprograme o cancele sus citas médicas de forma rápida y sencilla.
              Conectamos pacientes con los mejores especialistas.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-xl"
                onClick={() => router.push('/login')}
              >
                Iniciar Sesión <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => router.push('/register')}
              >
                Registrarse
              </Button>
            </div>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="group rounded-2xl border bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-heading font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sistema de Citas Médicas. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}