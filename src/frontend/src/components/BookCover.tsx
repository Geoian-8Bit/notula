import { CameraIcon } from './Icons';

interface Props {
  src?: string;
  alt?: string;
  /** Si no hay imagen y el componente actúa como uploader. */
  empty?: boolean;
  size?: 'md' | 'lg';
  /** Si false, no se pinta el "washi tape" arriba. */
  withTape?: boolean;
}

/**
 * Portada del libro. La forma y la sombra las dicta el material activo
 * (`.nt-cover` en index.css). Aquí solo se compone el contenido.
 */
export function BookCover({ src, alt = '', empty, size = 'md', withTape = true }: Props) {
  const dims = size === 'lg' ? 'w-[150px] h-[210px]' : 'w-[112px] h-[160px]';
  return (
    <div className={`relative ${dims}`}>
      {withTape && <span aria-hidden className="nt-tape left-1/2 top-[-8px] -translate-x-1/2" />}
      <div className="nt-cover flex h-full w-full items-center justify-center">
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span className="text-text-soft/70 flex flex-col items-center gap-1 text-xs">
            <CameraIcon size={26} />
            <span>{empty ? 'Portada' : ''}</span>
          </span>
        )}
      </div>
    </div>
  );
}
