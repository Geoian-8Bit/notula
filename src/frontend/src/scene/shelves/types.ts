import type { ComponentType } from 'react';

/**
 * Una balda dentro de la estantería: rango utilizable continuo, no
 * slots fijos. Los libros se packean desde startX hacia endX en orden
 * de `shelfOrder`. El `maxBookHeight` evita que un libro alto se
 * solape con la balda superior.
 */
export interface RowDef {
  /** Y world (m) sobre la que apoya la BASE del libro. */
  y: number;
  /** X world (m) izquierdo de la zona útil. */
  startX: number;
  /** X world (m) derecho de la zona útil. */
  endX: number;
  /** Profundidad world (z) del libro. Centro del libro en este Z. */
  z: number;
  /** Alto máximo permitido al libro en esta balda. */
  maxBookHeight: number;
}

/**
 * Cosmético de estantería. Empaqueta el modelo 3D y la geometría de
 * sus baldas. La BBDD guarda `userLibrary.shelfRow` y `shelfOrder`;
 * la geometría es 100% frontend.
 */
export interface ShelfCosmetic {
  id: string;
  displayName: string;
  rows: RowDef[];
  /**
   * Multiplicador uniforme aplicado a thickness/height/depth de TODOS
   * los libros del shelf. Default 1 = dimensiones reales. Subir si la
   * estantería es grande y los libros se ven raquíticos; bajar si los
   * libros se ven sobredimensionados. Cada cosmético elige el suyo
   * porque depende de la escala del .glb.
   */
  bookScale: number;
  /** Componente que renderiza el modelo 3D (sin libros). */
  Component: ComponentType;
}
