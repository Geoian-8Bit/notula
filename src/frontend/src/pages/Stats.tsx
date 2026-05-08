import { TopBar } from '../components/TopBar';
import { IconButton } from '../components/IconButton';
import { Card } from '../components/Card';
import { LeafIcon, MenuIcon } from '../components/Icons';
import { sampleBooks } from '../lib/sampleBooks';

export default function Stats() {
  const total = sampleBooks.length;
  const reading = sampleBooks.filter((b) => b.status === 'reading').length;
  const done = sampleBooks.filter((b) => b.status === 'done').length;
  const want = sampleBooks.filter((b) => b.status === 'want').length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <TopBar
        left={
          <IconButton label="Menú">
            <MenuIcon />
          </IconButton>
        }
        title={
          <>
            <span>Estadísticas</span>
            <LeafIcon className="text-accent-cool" size={18} />
          </>
        }
      />
      <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4 pt-3">
        <Card className="p-4">
          <p className="text-text-soft text-xs uppercase tracking-widest">Mi biblioteca</p>
          <p className="font-display text-text-strong mt-1 text-4xl">{total}</p>
          <p className="text-text-soft text-sm">libros registrados</p>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Leyendo" value={reading} />
          <Stat label="Leídos" value={done} />
          <Stat label="Por leer" value={want} />
        </div>

        <Card className="p-4">
          <p className="text-text-soft mb-3 text-xs uppercase tracking-widest">
            Lectura por estado
          </p>
          <BarRow label="Leídos" value={done} max={total} barClass="bg-accent-cool" />
          <BarRow label="Leyendo" value={reading} max={total} barClass="bg-accent" />
          <BarRow label="Por leer" value={want} max={total} barClass="bg-border" />
        </Card>

        <Card className="p-4">
          <p className="text-text-soft mb-2 text-xs uppercase tracking-widest">Racha</p>
          <p className="text-text-strong text-sm">
            Llevas <strong className="font-semibold">12 días</strong> leyendo seguidos.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="px-3 py-3 text-center">
      <p className="font-display text-text-strong text-2xl">{value}</p>
      <p className="text-text-soft text-[11px] uppercase tracking-wider">{label}</p>
    </Card>
  );
}

function BarRow({
  label,
  value,
  max,
  barClass,
}: {
  label: string;
  value: number;
  max: number;
  barClass: string;
}) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-text-soft">{label}</span>
        <span className="text-text-strong">{value}</span>
      </div>
      <div className="bg-surface-2/50 h-2 w-full overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full transition-all ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
