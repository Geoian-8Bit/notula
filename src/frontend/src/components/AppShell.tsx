import { Outlet } from 'react-router-dom';

/**
 * Marco "tipo móvil" centrado en pantalla. En desktop se ve como un teléfono;
 * en móvil ocupa toda la pantalla.
 *
 * Estado: minimalismo a propósito. La tab bar y el selector de paleta están
 * desactivados mientras iteramos la pantalla inicial. Vuelve a meterlos
 * cuando empecemos a navegar entre tabs.
 */
export function AppShell() {
  return (
    <div className="bg-page text-text-strong h-dvh w-dvw overflow-hidden">
      <div className="bg-surface/30 mx-auto flex h-full max-w-[440px] flex-col shadow-2xl sm:my-2 sm:h-[calc(100dvh-1rem)] sm:rounded-[40px] sm:ring-1 sm:ring-black/5">
        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden sm:rounded-[40px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
