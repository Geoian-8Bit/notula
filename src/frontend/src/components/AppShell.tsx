import { Outlet } from 'react-router-dom';
import { BottomTabs } from './BottomTabs';
import { ThemePalette } from '../theme/ThemePalette';

/**
 * Marco "tipo móvil" centrado en pantalla. En desktop se ve como un teléfono;
 * en móvil ocupa toda la pantalla.
 */
export function AppShell() {
  return (
    <div className="bg-page text-text-strong h-dvh w-dvw overflow-hidden">
      <div className="bg-surface/30 mx-auto flex h-full max-w-[440px] flex-col shadow-2xl sm:my-2 sm:h-[calc(100dvh-1rem)] sm:rounded-[40px] sm:ring-1 sm:ring-black/5">
        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden sm:rounded-t-[40px]">
          <Outlet />
          {/* Paleta flotante encima de la tab bar */}
          <div className="pointer-events-none absolute right-3 top-[68px] z-20">
            <div className="pointer-events-auto">
              <ThemePalette />
            </div>
          </div>
        </main>
        <BottomTabs />
      </div>
    </div>
  );
}
