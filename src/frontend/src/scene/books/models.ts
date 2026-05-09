/**
 * Registro de modelos 3D de libros disponibles en la app. Los nombres
 * corresponden a nodos top-level del FBX `Book_pack.fbx`. Las dims
 * (m) salen del inspector `/dev/inspect-books` con scale=1 (el FBX
 * está en metros).
 *
 * Para añadir/quitar modelos: actualizar este array. El loader
 * (`loader.ts`) usa los nombres `keptBookNames` para hacer fallback de
 * las texturas no incluidas en `/public/models/books/textures/` a
 * una existente, evitando 404 en la consola.
 */

export interface BookModelSpec {
  /** Nombre del nodo top-level dentro del FBX (sigue válido para el inspector). */
  name: string;
  /**
   * Dimensiones (m) tras orientación efectiva (libro de pie):
   *   x = grosor (lomo)
   *   y = altura
   *   z = profundidad hacia la pared
   * Cada modelo tiene proporciones distintas para que se diferencien
   * a simple vista en la balda.
   */
  dims: { x: number; y: number; z: number };
  /**
   * Color base del lomo/portadas. El render multiplica el tinte
   * deterministico por instancia sobre este color, así dos libros
   * del mismo modelo no son idénticos.
   */
  baseColor: string;
}

/**
 * Rotación (radianes, Euler order 'XYZ') aplicada a cada nodo FBX
 * antes del placement. El FBX viene con el libro tumbado y el lomo
 * mirando +X. Encadenamos:
 *   1. Rz(+90°)  → lomo va de +X a +Y (queda apuntando hacia arriba)
 *   2. Rx(+90°)  → +Y pasa a +Z (lomo apunta a cámara)
 *
 * En three.js la rotación XYZ se aplica como Rx · Ry · Rz al vector;
 * es decir Rz primero, luego Rx, lo que coincide con el plan.
 *
 * Tras la rotación, el bbox del libro cambia de orientación:
 *   x_raw = 0.1763 → z_eff = 0.1763 (profundidad hacia la pared)
 *   y_raw = 0.0569 → x_eff = 0.0569 (grosor del lomo)
 *   z_raw = 0.2352 → y_eff = 0.2352 (altura del libro)
 */
export const BOOK_PACK_ORIENTATION: [number, number, number] = [Math.PI / 2, 0, Math.PI / 2];

/**
 * Modelos de "lomo de saga": 8 perfiles de proporciones distintas
 * con colores variados (mezcla pastel + tonos profundos + acentos
 * vibrantes). Cada saga elige modelo por hash → dos sagas distintas
 * típicamente quedan con formas y colores distintos.
 *
 * Rangos:
 *   grosor (x): 0.045 – 0.082 m  (4.5 – 8.2 cm)
 *   altura (y): 0.200 – 0.240 m  (20 – 24 cm)
 *   fondo  (z): 0.155 – 0.185 m  (15.5 – 18.5 cm)
 *
 * Multiplicado por bookScale del cosmético (ej. 1.4 → 6.3–11.5 cm).
 */
export const BOOK_MODELS: BookModelSpec[] = [
  { name: 'Book_1', dims: { x: 0.052, y: 0.22, z: 0.165 }, baseColor: '#1D3557' }, // azul tinta
  { name: 'Book_3', dims: { x: 0.058, y: 0.215, z: 0.17 }, baseColor: '#7A2E2E' }, // burdeos
  { name: 'Book_8', dims: { x: 0.075, y: 0.205, z: 0.18 }, baseColor: '#3F5C42' }, // verde oliva
  { name: 'Book_11', dims: { x: 0.046, y: 0.235, z: 0.158 }, baseColor: '#E0B056' }, // mostaza
  { name: 'Book_12', dims: { x: 0.063, y: 0.21, z: 0.175 }, baseColor: '#2F2A29' }, // grafito
  { name: 'Book_13', dims: { x: 0.07, y: 0.225, z: 0.172 }, baseColor: '#8B4A3A' }, // terracota
  { name: 'Book_14', dims: { x: 0.05, y: 0.23, z: 0.16 }, baseColor: '#E8D9BD' }, // crema
  { name: 'Book_15', dims: { x: 0.055, y: 0.205, z: 0.178 }, baseColor: '#4A6B7A' }, // teal apagado
];

/** Set de nombres incluidos para chequeo rápido. */
export const KEPT_BOOK_NAMES = new Set(BOOK_MODELS.map((m) => m.name));

/** Texturas que SI existen en disk (usadas como fallback). */
export const KEPT_TEXTURE_NAMES = new Set([
  'Book_1.jpeg',
  'Book_3.jpeg',
  'Book_8.jpeg',
  'Book_11.jpeg',
  'Book_12.jpeg',
  'paper_1.jpeg',
  'paper_2.jpeg',
]);

/** Textura "neutra" usada cuando se solicita una eliminada. */
export const FALLBACK_TEXTURE = 'Book_1.jpeg';
