import type { ReactNode } from 'react';

interface Props {
  left?: ReactNode;
  title?: ReactNode;
  right?: ReactNode;
  /** Decoración opcional (hojita, tape, etc.) absoluta en la esquina derecha. */
  decoration?: ReactNode;
}

/**
 * Top bar con tres slots y altura fija (≥44px tap target).
 * No usa sticky: la responsabilidad de fijarla está en el AppShell.
 */
export function TopBar({ left, title, right, decoration }: Props) {
  return (
    <div className="bg-page/95 border-border/40 relative z-10 flex h-14 items-center gap-2 border-b px-3 backdrop-blur">
      <div className="flex w-12 items-center justify-start">{left}</div>
      <div className="text-text-strong flex flex-1 items-center justify-center gap-2 text-base font-medium">
        {title}
      </div>
      <div className="flex w-12 items-center justify-end">{right}</div>
      {decoration && <div className="pointer-events-none absolute right-2 top-1">{decoration}</div>}
    </div>
  );
}
