import { useThemeStore } from './store';
import { themes, styleOrder, type StyleId } from './themes';

interface Props {
  className?: string;
}

/**
 * Selector horizontal de los 4 materiales (chips). Pensado para auth y para
 * pantallas donde queremos mostrar las opciones siempre visibles.
 */
export function ThemeSwitcher({ className }: Props) {
  const current = useThemeStore((s) => s.styleId);
  const setStyle = useThemeStore((s) => s.setStyle);

  return (
    <div
      role="radiogroup"
      aria-label="Estilo visual"
      className={
        'nt-popover pointer-events-auto flex items-center gap-2 p-1.5 ' + (className ?? '')
      }
    >
      {styleOrder.map((id) => (
        <StyleChip key={id} id={id} active={current === id} onSelect={() => setStyle(id)} />
      ))}
    </div>
  );
}

function StyleChip({
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
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={`Estilo ${t.name}`}
      title={`${t.name} · ${t.tagline}`}
      onClick={onSelect}
      className={
        'group relative flex h-10 min-w-[2.75rem] items-center gap-1 rounded-full px-2 transition-all ' +
        (active ? 'ring-accent/70 bg-page/80 ring-2' : 'hover:bg-page/50 ring-2 ring-transparent')
      }
    >
      <span
        className="block h-5 w-2.5 rounded-full"
        style={{ background: t.tokens.page }}
        aria-hidden
      />
      <span
        className="block h-5 w-2.5 rounded-full"
        style={{ background: t.tokens.accent }}
        aria-hidden
      />
      <span
        className="block h-5 w-2.5 rounded-full"
        style={{ background: t.tokens.accentCool }}
        aria-hidden
      />
      <span
        className={
          'ml-1 hidden text-[10px] font-medium uppercase tracking-wide sm:inline ' +
          (active ? 'text-text-strong' : 'text-text-soft')
        }
      >
        {t.name}
      </span>
    </button>
  );
}
