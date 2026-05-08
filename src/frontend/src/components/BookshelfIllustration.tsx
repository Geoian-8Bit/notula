import { useMemo } from 'react';
import { useTheme } from '../theme/useTheme';
import type { ThemeIllustration } from '../theme/themes';

/**
 * Ilustración 2D de la estantería principal. La forma/sombra/textura de cada
 * libro y de las baldas la dicta el material activo (.nt-book / .nt-shelf-board
 * en index.css). Aquí solo dibujamos la composición.
 */
export function BookshelfIllustration() {
  const { illustration } = useTheme();
  return (
    <div className="nt-shelf-back flex h-full w-full flex-col">
      <DecorTop illustration={illustration} />
      <Board illustration={illustration} thick />
      <BookRow illustration={illustration} seed={101} />
      <Board illustration={illustration} />
      <BookRow illustration={illustration} seed={202} />
      <Board illustration={illustration} />
      <BookRow illustration={illustration} seed={303} hasPlant />
      <Board illustration={illustration} thick />
    </div>
  );
}

function Board({
  illustration,
  thick = false,
}: {
  illustration: ThemeIllustration;
  thick?: boolean;
}) {
  const h = thick ? 14 : 10;
  return (
    <div
      className="nt-shelf-board mx-2 shrink-0"
      style={{
        height: `${h}px`,
        background: `linear-gradient(180deg, ${illustration.shelfWoodLight} 0%, ${illustration.shelfWood} 100%)`,
      }}
    />
  );
}

function DecorTop({ illustration }: { illustration: ThemeIllustration }) {
  return (
    <div className="relative flex h-[28%] min-h-[110px] items-end justify-around px-4 pb-1">
      <HangingPlant illustration={illustration} />
      <PictureFrame illustration={illustration} />
      <PottedPlant illustration={illustration} small />
    </div>
  );
}

/* ------------------------------------------------------------------ books */

interface BookSlot {
  width: number;
  height: number;
  color: string;
  floral: boolean;
  tilt: boolean;
}

const BOOKS_PER_ROW = 13;

function BookRow({
  illustration,
  seed,
  hasPlant = false,
}: {
  illustration: ThemeIllustration;
  seed: number;
  hasPlant?: boolean;
}) {
  const slots = useMemo(() => buildBooks(seed, illustration), [seed, illustration]);
  // Si hay planta, dejamos hueco al final.
  const visibleSlots = hasPlant ? slots.slice(0, BOOKS_PER_ROW - 3) : slots;
  return (
    <div className="relative flex flex-1 items-end gap-[3px] overflow-hidden px-3 pb-[2px] pt-1">
      {visibleSlots.map((slot, i) => (
        <Book key={i} slot={slot} accent={illustration.bookCreamAccent} />
      ))}
      {hasPlant && (
        <div className="ml-1 flex flex-1 items-end justify-end pb-1">
          <PottedPlant illustration={illustration} />
        </div>
      )}
    </div>
  );
}

function Book({ slot, accent }: { slot: BookSlot; accent: string }) {
  const isCream = !slot.tilt && slot.color.toLowerCase() === slot.color.toLowerCase();
  // El "florón" sale solo en libros crema.
  return (
    <div
      className="nt-book"
      style={{
        width: `${slot.width}px`,
        height: `${slot.height}%`,
        background: slot.color,
        flexShrink: 0,
      }}
    >
      {slot.floral && (
        <span
          className="absolute left-1/2 top-1/2 block h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: accent, opacity: 0.6 }}
          aria-hidden
        />
      )}
      {slot.floral && (
        <span
          className="absolute left-1/2 top-[28%] block h-[3px] w-[3px] -translate-x-1/2 rounded-full"
          style={{ background: accent, opacity: 0.5 }}
          aria-hidden
        />
      )}
      {/* Sutil topline */}
      <span
        aria-hidden
        className="absolute left-0 right-0 top-0 h-[2px]"
        style={{ background: 'rgba(0,0,0,0.06)' }}
      />
      <span aria-hidden className="hidden">
        {isCream ? '' : ''}
      </span>
    </div>
  );
}

function buildBooks(seed: number, ill: ThemeIllustration): BookSlot[] {
  const rand = mulberry32(seed);
  const slots: BookSlot[] = [];
  // Patrón: posiciones fijas para acentos (como en la referencia).
  const accentPositions = new Set<number>();
  if (seed === 202) [0, 1, 2, 3].forEach((p) => accentPositions.add(p));
  if (seed === 101) accentPositions.add(7);
  for (let i = 0; i < BOOKS_PER_ROW; i++) {
    const isAccent = accentPositions.has(i);
    const color = isAccent
      ? (ill.bookAccents[(i + seed) % ill.bookAccents.length] ?? ill.bookCream)
      : ill.bookCream;
    const width = 16 + Math.round(rand() * 12); // 16-28 px
    const height = 78 + Math.round(rand() * 18); // 78-96% del row
    const floral = !isAccent && i % 2 === 0;
    const tilt = i === BOOKS_PER_ROW - 1 && seed === 101;
    slots.push({ width, height, color, floral, tilt });
  }
  return slots;
}

/* --------------------------------------------------------------- plantas */

function PottedPlant({
  illustration,
  small = false,
}: {
  illustration: ThemeIllustration;
  small?: boolean;
}) {
  const w = small ? 56 : 72;
  return (
    <svg viewBox="0 0 72 100" width={w} height={small ? 80 : 100} aria-hidden>
      {/* Pot */}
      <path
        d={'M22 70 H50 L46 96 H26 Z'}
        fill={illustration.plantPot}
        stroke="rgba(0,0,0,0.10)"
        strokeWidth="0.8"
      />
      {/* Leaves cluster */}
      <g>
        <ellipse cx="36" cy="48" rx="20" ry="22" fill={illustration.plantLeaf} />
        <ellipse cx="22" cy="56" rx="12" ry="14" fill={illustration.plantLeafDark} />
        <ellipse cx="50" cy="56" rx="11" ry="13" fill={illustration.plantLeafDark} />
        <ellipse cx="36" cy="32" rx="10" ry="11" fill={illustration.plantLeaf} />
        {/* Veins */}
        <path d="M36 28 V60" stroke="rgba(0,0,0,0.15)" strokeWidth="0.6" fill="none" />
      </g>
    </svg>
  );
}

function HangingPlant({ illustration }: { illustration: ThemeIllustration }) {
  return (
    <svg viewBox="0 0 110 130" width={88} height={100} aria-hidden>
      {/* Pot */}
      <path
        d={'M30 0 H80 L74 22 H36 Z'}
        fill={illustration.plantPot}
        stroke="rgba(0,0,0,0.10)"
        strokeWidth="0.8"
      />
      {/* Long trailing leaves */}
      <g fill={illustration.plantLeaf}>
        <ellipse cx="20" cy="40" rx="10" ry="20" transform="rotate(-15 20 40)" />
        <ellipse cx="14" cy="80" rx="8" ry="22" transform="rotate(-25 14 80)" />
        <ellipse cx="55" cy="60" rx="11" ry="22" />
        <ellipse cx="56" cy="100" rx="9" ry="22" />
        <ellipse cx="92" cy="42" rx="10" ry="20" transform="rotate(20 92 42)" />
        <ellipse cx="98" cy="84" rx="8" ry="22" transform="rotate(28 98 84)" />
      </g>
      <g fill={illustration.plantLeafDark} opacity="0.85">
        <ellipse cx="30" cy="55" rx="6" ry="14" transform="rotate(-12 30 55)" />
        <ellipse cx="80" cy="65" rx="6" ry="14" transform="rotate(15 80 65)" />
      </g>
    </svg>
  );
}

function PictureFrame({ illustration }: { illustration: ThemeIllustration }) {
  return (
    <div
      className="relative h-[88px] w-[68px] overflow-hidden rounded-[3px] border-[3px]"
      style={{ borderColor: illustration.frame, background: illustration.frameImage }}
      aria-hidden
    >
      {/* Mini paisaje pastel: cielo/sol/montaña */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${illustration.bookCream} 0%, ${illustration.bookCream} 50%, ${illustration.frameImage} 50%, ${illustration.frameImage} 100%)`,
        }}
      />
      <div
        className="absolute left-1/2 top-[26%] h-3 w-3 -translate-x-1/2 rounded-full"
        style={{ background: illustration.plantPot, opacity: 0.7 }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[34%]"
        style={{
          background: illustration.plantLeafDark,
          clipPath: 'polygon(0 100%, 0 60%, 30% 30%, 50% 60%, 70% 30%, 100% 60%, 100% 100%)',
        }}
      />
    </div>
  );
}

/** PRNG estable. */
function mulberry32(a: number) {
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
