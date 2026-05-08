import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import { BooksIcon, PlusIcon, HeartIcon, BarChartIcon } from './Icons';

interface TabDef {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
}

const TABS: TabDef[] = [
  { to: '/', label: 'Estantería', icon: <BooksIcon />, end: true },
  { to: '/add', label: 'Agregar', icon: <PlusIcon /> },
  { to: '/favorites', label: 'Favoritos', icon: <HeartIcon /> },
  { to: '/stats', label: 'Estadísticas', icon: <BarChartIcon /> },
];

/**
 * Tab bar inferior fija. La pestaña activa lleva una pill `surface-2` detrás
 * del icono, igual que en la referencia.
 */
export function BottomTabs() {
  return (
    <nav
      aria-label="Navegación principal"
      className="bg-page/95 border-border/40 relative z-10 flex h-[72px] items-stretch border-t pb-[max(env(safe-area-inset-bottom),0px)] backdrop-blur"
    >
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) =>
            'group relative flex flex-1 flex-col items-center justify-center gap-1 ' +
            (isActive ? 'text-text-strong' : 'text-text-soft hover:text-text-strong')
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={
                  'inline-flex h-10 w-12 items-center justify-center rounded-full transition ' +
                  (isActive ? 'bg-accent/15' : '')
                }
              >
                <span className="[&>svg]:h-[22px] [&>svg]:w-[22px]">{t.icon}</span>
              </span>
              <span className="text-[11px] font-medium tracking-wide">{t.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
