import { HeartIcon, LeafIcon } from './Icons';
import { Card } from './Card';

interface Props {
  message?: string;
}

/** Tarjeta de saludo con un detalle de planta y un corazón a la derecha. */
export function GreetingCard({ message = 'Lee, sueña, repite.' }: Props) {
  return (
    <Card variant="soft" className="mx-4 mt-3 flex items-center gap-3 px-4 py-3" data-theme-aware>
      <span className="bg-accent-cool/25 text-accent-cool inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
        <LeafIcon size={20} />
      </span>
      <p className="text-text-soft flex-1 truncate text-sm">{message}</p>
      <HeartIcon className="text-text-soft" size={18} />
    </Card>
  );
}
