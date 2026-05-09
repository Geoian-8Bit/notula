import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from './client';
import { runDevAutoLogin } from './devAutoLogin';

interface Props {
  children: ReactNode;
}

type DevLoginState = 'idle' | 'running' | 'failed';

export function RequireAuth({ children }: Props) {
  const { data: session, isPending } = useSession();
  const location = useLocation();
  const [devLogin, setDevLogin] = useState<DevLoginState>('idle');

  // En dev, si no hay sesión, intentamos auto-loguear una cuenta de
  // pruebas para no bloquear iteración. En prod este efecto no corre
  // porque `import.meta.env.DEV` es false.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (isPending || session || devLogin !== 'idle') return;
    setDevLogin('running');
    runDevAutoLogin().then((res) => {
      setDevLogin(res.ok ? 'idle' : 'failed');
    });
  }, [isPending, session, devLogin]);

  if (isPending || devLogin === 'running') {
    return (
      <div className="bg-page text-text-soft flex h-dvh w-dvw items-center justify-center">
        <span className="font-display animate-pulse text-xl">Abriendo la biblioteca…</span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
