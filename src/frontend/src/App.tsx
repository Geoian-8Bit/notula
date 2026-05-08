import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from './auth/RequireAuth';
import { useSession, signOut } from './auth/client';
import { Library } from './scene/Library';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <LibraryShell />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

function LibraryShell() {
  const { data: session } = useSession();
  return (
    <main className="relative h-dvh w-dvw overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        <Library />
      </Suspense>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
        <h1 className="font-display text-parchment text-3xl tracking-wide">Notula</h1>
        <div className="pointer-events-auto flex items-center gap-3">
          {session?.user.name && (
            <span className="text-parchment-muted hidden text-sm sm:inline">
              {session.user.name}
            </span>
          )}
          <button
            onClick={() => void signOut()}
            className="bg-ink-soft/70 text-parchment-muted hover:text-parchment rounded-full px-3 py-1 text-xs uppercase tracking-widest backdrop-blur transition"
          >
            Salir
          </button>
        </div>
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
