import { Suspense } from 'react';
import { MenuIcon } from '../components/Icons';
import { Library } from '../scene/Library';

/**
 * Pantalla inicial: barra superior con efecto madera y, debajo, el espacio
 * 3D real (habitación + estantería). El resto se construirá encima.
 */
export default function Shelf() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <WoodHeader />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Suspense fallback={null}>
          <Library />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * Tablón de madera fijo arriba. No depende del tema activo: usa colores
 * propios (nogal cálido) para que el cuerpo de la app pueda probar paletas
 * sin que la cabecera cambie.
 */
function WoodHeader() {
  return (
    <header
      className="relative flex h-16 shrink-0 items-center justify-center px-3 shadow-[0_4px_14px_rgba(42,24,16,0.22)]"
      style={{
        background: 'linear-gradient(180deg, #9A7A55 0%, #6B5132 100%)',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      {/* Veta de madera */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='64'><g stroke='%234A3520' stroke-opacity='0.55' stroke-width='0.5' fill='none'><path d='M0 8 Q50 6 100 10 T200 8'/><path d='M0 22 Q50 24 100 20 T200 22'/><path d='M0 36 Q50 34 100 38 T200 36'/><path d='M0 50 Q50 52 100 48 T200 50'/></g></svg>\")",
        }}
      />
      {/* Highlight superior + sombra inferior — espesor del tablón */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/30" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/45"
      />

      <button
        type="button"
        aria-label="Menú"
        className="hover:bg-white/12 absolute left-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#F2E5C8] transition active:bg-white/20"
      >
        <MenuIcon />
      </button>

      <h1 className="font-display relative text-2xl tracking-wide text-[#F2E5C8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
        Dream Library
      </h1>
    </header>
  );
}
