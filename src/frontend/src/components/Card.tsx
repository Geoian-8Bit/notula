import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  /** soft = superficie principal · deep = ligeramente más oscura · outline = sólo borde */
  variant?: 'soft' | 'outline' | 'deep';
}

/**
 * Tarjeta cozy. La forma, el borde y la sombra los dicta el material activo
 * (ver `[data-style] .nt-card` en index.css). Aquí sólo metemos layout.
 */
export function Card({ variant = 'soft', className = '', ...rest }: Props) {
  const v =
    variant === 'deep'
      ? 'nt-card-deep'
      : variant === 'outline'
        ? 'nt-card border-border bg-transparent'
        : 'nt-card';
  return <div className={`${v} ${className}`} {...rest} />;
}
