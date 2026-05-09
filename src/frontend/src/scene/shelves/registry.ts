import type { ShelfCosmetic } from './types';
import { starterOak } from './starter-oak';

/**
 * Registro de shelves disponibles. Para añadir uno nuevo: drop del .glb
 * en /public/models/, archivo `<id>.tsx` en esta carpeta exportando un
 * `ShelfCosmetic`, y una línea aquí.
 */
export const SHELVES: Record<string, ShelfCosmetic> = {
  [starterOak.id]: starterOak,
};

export const DEFAULT_SHELF_ID = starterOak.id;

export function getShelf(id: string | null | undefined): ShelfCosmetic {
  if (id && SHELVES[id]) return SHELVES[id];
  return SHELVES[DEFAULT_SHELF_ID]!;
}
