import { Suspense } from 'react';
import { Library } from './scene/Library';

export default function App() {
  return (
    <main className="relative h-dvh w-dvw overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        <Library />
      </Suspense>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
        <h1 className="font-display text-parchment text-3xl tracking-wide">Notula</h1>
        <span className="bg-ink-soft/70 text-parchment-muted rounded-full px-3 py-1 text-xs uppercase tracking-widest backdrop-blur">
          α 0.1
        </span>
      </header>
    </main>
  );
}

function LoadingScreen() {
  return (
    <div className="text-parchment-muted flex h-full w-full items-center justify-center">
      <span className="font-display animate-pulse text-xl">Abriendo la biblioteca…</span>
    </div>
  );
}
