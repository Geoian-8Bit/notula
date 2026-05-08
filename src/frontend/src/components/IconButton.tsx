import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

/**
 * Botón circular tap-target ≥44px con icono dentro. Sin fondo por defecto;
 * el hover/active subrayan con `surface-2`.
 */
export function IconButton({ label, className = '', children, ...rest }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      className={
        'text-text-strong hover:bg-surface-2/70 active:bg-surface-2 inline-flex h-11 w-11 items-center justify-center rounded-full transition ' +
        className
      }
      {...rest}
    >
      {children}
    </button>
  );
}
