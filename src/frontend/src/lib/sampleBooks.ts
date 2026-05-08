export type ReadStatus = 'want' | 'reading' | 'done';

export interface SampleBook {
  id: string;
  title: string;
  author: string;
  status: ReadStatus;
  rating: number; // 0-5
  ratings: number;
  quote?: string;
  note?: string;
  coverColor: string; // hex (placeholder mientras no haya portada)
  /** Color del lomo del libro en la estantería 3D — sutil, en armonía con el tema. */
  spineHint: 'sage' | 'lavender' | 'peach' | 'dust' | 'cream';
  category: string;
}

/** Datos de ejemplo para placeholders. No se persisten. */
export const sampleBooks: SampleBook[] = [
  {
    id: 'principito',
    title: 'El Principito',
    author: 'Antoine de Saint-Exupéry',
    status: 'done',
    rating: 4.5,
    ratings: 128,
    quote: 'Lo esencial es invisible a los ojos.',
    note: 'Mi parte favorita del libro',
    coverColor: '#E5D4AE',
    spineHint: 'cream',
    category: 'Clásicos',
  },
  {
    id: 'norwegian-wood',
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    status: 'reading',
    rating: 4,
    ratings: 86,
    coverColor: '#A8B5C2',
    spineHint: 'dust',
    category: 'Ficción',
  },
  {
    id: 'kiki',
    title: 'Kiki, la pequeña bruja',
    author: 'Eiko Kadono',
    status: 'done',
    rating: 4.5,
    ratings: 64,
    coverColor: '#C97B5C',
    spineHint: 'peach',
    category: 'Infantil',
  },
  {
    id: 'heidi',
    title: 'Heidi',
    author: 'Johanna Spyri',
    status: 'want',
    rating: 0,
    ratings: 0,
    coverColor: '#9DAE89',
    spineHint: 'sage',
    category: 'Clásicos',
  },
  {
    id: 'heartstopper',
    title: 'Heartstopper',
    author: 'Alice Oseman',
    status: 'reading',
    rating: 5,
    ratings: 240,
    coverColor: '#B8A5C2',
    spineHint: 'lavender',
    category: 'Novela gráfica',
  },
];

export const STATUS_LABEL: Record<ReadStatus, string> = {
  want: 'Quiero leer',
  reading: 'Leyendo',
  done: 'Leído',
};
