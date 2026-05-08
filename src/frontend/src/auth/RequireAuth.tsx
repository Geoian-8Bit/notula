import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from './client';

interface Props {
  children: ReactNode;
}

export function RequireAuth({ children }: Props) {
  const { data: session, isPending } = useSession();
  const location = useLocation();

  if (isPending) {
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
