/**
 * Variación visual deterministica por libro. Mismo `id` → misma
 * elección de modelo + misma inclinación base entre sesiones.
 *
 * El pack actual tiene 5 modelos con geometría idéntica y texturas
 * distintas, así que la variación visible es 100% la portada elegida.
 */

import { BOOK_MODELS, type BookModelSpec } from './models';

function xmur3(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

export function hashToFloat(s: string): number {
  return xmur3(s) / 4294967296;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export interface BookVariation {
  /** Nombre del nodo FBX a clonar. Debe existir en BOOK_MODELS. */
  modelName: string;
  /** Tilt base estable, ±~1° en radianes. Se suma al tilt emergente. */
  baseTilt: number;
}

export interface BookVariationInput {
  id: string;
}

export function bookVariation(input: BookVariationInput): BookVariation {
  const { id } = input;
  const seedModel = hashToFloat(id + ':model');
  const seedTilt = hashToFloat(id + ':tilt');
  const idx = Math.min(BOOK_MODELS.length - 1, Math.floor(seedModel * BOOK_MODELS.length));
  return {
    modelName: BOOK_MODELS[idx]!.name,
    baseTilt: (seedTilt - 0.5) * 0.035,
  };
}

/**
 * Selecciona un modelo para `id` evitando los colores que ya tienen
 * los vecinos. Recorre los modelos empezando por el que daría la
 * elección por hash y retorna el primero cuyo `baseColor` no esté en
 * `avoidColors`. Si todos los modelos conflictan (shouldn't happen
 * con paleta de 8 colores), cae en el preferido por hash.
 */
export function pickModelAvoiding(id: string, avoidColors: string[]): BookModelSpec {
  const seed = hashToFloat(id + ':model');
  const startIdx = Math.floor(seed * BOOK_MODELS.length);
  for (let offset = 0; offset < BOOK_MODELS.length; offset++) {
    const idx = (startIdx + offset) % BOOK_MODELS.length;
    const model = BOOK_MODELS[idx]!;
    if (!avoidColors.includes(model.baseColor)) return model;
  }
  return BOOK_MODELS[startIdx % BOOK_MODELS.length]!;
}

export interface NeighborInfo {
  /** Hay un libro pegado a este lado. False = extremo de balda o hueco. */
  exists: boolean;
}

/**
 * Tilt emergente. En modelo packed sin huecos intermedios, los únicos
 * vecinos vacíos son los de los extremos: primer libro de la balda no
 * tiene izquierdo, último no tiene derecho. Esos son los que caen.
 */
export function computeTilt(
  base: BookVariation,
  left: NeighborInfo,
  right: NeighborInfo,
  seedKey: string,
): number {
  const seed = hashToFloat(seedKey + ':lean');
  if (!right.exists && left.exists) {
    return base.baseTilt + lerp(0.1, 0.18, seed);
  }
  if (!left.exists && right.exists) {
    return base.baseTilt - lerp(0.06, 0.12, seed);
  }
  if (!left.exists && !right.exists) {
    // Único en la balda: cae un poco a la derecha.
    return base.baseTilt + lerp(0.04, 0.1, seed);
  }
  return base.baseTilt;
}
