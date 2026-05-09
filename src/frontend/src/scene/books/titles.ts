import { hashToFloat } from './variation';

/**
 * Mock: lista de sagas conocidas para que la estantería tenga aspecto
 * "real" mientras no haya backend. Cada entrada incluye nombre y
 * número de libros típicos de la saga (sólo informativo; el mock
 * usa el hash para dispersar).
 *
 * Cuando el backend esté listo, este array desaparece y los datos
 * vienen de `userLibrary` agrupado por `series`.
 */
export interface MockSaga {
  title: string;
  bookCount: number;
}

const MOCK_SAGAS: MockSaga[] = [
  { title: 'Harry Potter', bookCount: 7 },
  { title: 'El Señor de los Anillos', bookCount: 3 },
  { title: 'Crónicas de Narnia', bookCount: 7 },
  { title: 'Canción de Hielo y Fuego', bookCount: 5 },
  { title: 'Mistborn', bookCount: 6 },
  { title: 'El Archivo de las Tormentas', bookCount: 4 },
  { title: 'Geralt de Rivia', bookCount: 8 },
  { title: 'Millennium', bookCount: 6 },
  { title: 'Sherlock Holmes', bookCount: 9 },
  { title: 'Fundación', bookCount: 7 },
  { title: 'Dune', bookCount: 6 },
  { title: 'La Torre Oscura', bookCount: 8 },
  { title: 'Los Pilares de la Tierra', bookCount: 4 },
  { title: 'La Rueda del Tiempo', bookCount: 14 },
  { title: 'Una Serie de Catastróficas Desdichas', bookCount: 13 },
  { title: 'Outlander', bookCount: 9 },
  { title: 'Crepúsculo', bookCount: 4 },
  { title: 'Los Juegos del Hambre', bookCount: 4 },
  { title: 'Shadowhunters', bookCount: 6 },
  { title: 'Percy Jackson', bookCount: 5 },
  { title: 'Las Crónicas de Riftwar', bookCount: 4 },
  { title: 'Kingkiller', bookCount: 3 },
];

export function pickSaga(id: string): MockSaga {
  const seed = hashToFloat(id + ':saga');
  const idx = Math.min(MOCK_SAGAS.length - 1, Math.floor(seed * MOCK_SAGAS.length));
  return MOCK_SAGAS[idx]!;
}
