interface Props {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  /** Si se pasa "span", se renderiza decorativo y no clickable. */
  as?: 'button' | 'span';
}

/** Pill de estado ("Quiero leer", "Leyendo", "Leído"). El look depende del material. */
export function StatusPill({ active = false, onClick, children, as = 'button' }: Props) {
  const dataActive = active ? 'true' : 'false';
  if (as === 'span') {
    return (
      <span className="nt-pill" data-active={dataActive}>
        {children}
      </span>
    );
  }
  return (
    <button type="button" onClick={onClick} className="nt-pill" data-active={dataActive}>
      {children}
    </button>
  );
}
