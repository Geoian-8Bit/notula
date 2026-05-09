import { useMemo } from 'react';
import type { LibraryBookData } from './BookLayout';

/**
 * Datos mock hasta que tengamos `userLibrary.shelfRow + shelfOrder` en
 * BBDD. Genera 6 libros por balda, ids estables. Como cada libro
 * elige su modelo (textura) por hash de su id, los mismos ids dan
 * siempre el mismo surtido entre sesiones.
 */
export function useMockBooks(rowCount: number): LibraryBookData[] {
  return useMemo(() => buildMock(rowCount), [rowCount]);
}

const BOOKS_PER_ROW = 12;

function buildMock(rowCount: number): LibraryBookData[] {
  const out: LibraryBookData[] = [];
  for (let row = 0; row < rowCount; row++) {
    for (let order = 0; order < BOOKS_PER_ROW; order++) {
      out.push({
        id: `mock-r${row}-o${order}`,
        shelfRow: row,
        shelfOrder: order,
      });
    }
  }
  return out;
}
