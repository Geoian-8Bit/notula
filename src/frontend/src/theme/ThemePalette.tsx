import { useEffect, useRef, useState } from 'react';
import { PaletteIcon, CheckIcon } from '../components/Icons';
import { signOut } from '../auth/client';
import { useThemeStore } from './store';
import { themes, styleOrder, type StyleId } from './themes';

/**
 * Botón flotante con popover para alternar entre los 4 materiales.
 * Pensado para colocarse libre en una esquina sin invadir la composición.
 */
export function ThemePalette() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const current = useThemeStore((s) => s.styleId);
  const setStyle = useThemeStore((s) => s.setStyle);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Cambiar estilo visual"
        onClick={() => setOpen((o) => !o)}
        className="nt-fab text-text-strong flex h-11 w-11 items-center justify-center"
      >
        <PaletteIcon size={20} />
      </button>
      {open && (
        <div role="menu" className="nt-popover absolute right-0 top-12 z-30 w-60 p-2">
          <p className="text-text-soft px-2 pb-1 pt-1 text-[11px] font-medium uppercase tracking-widest">
            Material
          </p>
          <ul className="space-y-1">
            {styleOrder.map((id) => (
              <StyleRow
                key={id}
                id={id}
                active={current === id}
                onSelect={() => {
                  setStyle(id);
                  setOpen(false);
                }}
              />
            ))}
          </ul>
          <div className="border-border/50 mt-2 border-t pt-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
              className="text-text-soft hover:text-text-strong hover:bg-page w-full rounded-xl px-3 py-2 text-left text-sm transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StyleRow({
  id,
  active,
  onSelect,
}: {
  id: StyleId;
  active: boolean;
  onSelect: () => void;
}) {
  const t = themes[id];
  return (
    <li>
      <button
        type="button"
        role="menuitemradio"
        aria-checked={active}
        onClick={onSelect}
        className={
          'flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition ' +
          (active ? 'bg-page' : 'hover:bg-page')
        }
      >
        <span className="flex shrink-0 gap-1">
          <Swatch color={t.tokens.page} />
          <Swatch color={t.tokens.accent} />
          <Swatch color={t.tokens.accentCool} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-text-strong block text-sm font-medium">{t.name}</span>
          <span className="text-text-soft block text-[11px] uppercase tracking-wider">
            {t.tagline}
          </span>
        </span>
        {active && <CheckIcon className="text-accent-deep" size={18} />}
      </button>
    </li>
  );
}

function Swatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="border-border/40 inline-block h-5 w-2.5 rounded-full border"
      style={{ background: color }}
    />
  );
}
