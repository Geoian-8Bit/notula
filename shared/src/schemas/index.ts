import { z } from 'zod';

export const isbnSchema = z
  .string()
  .regex(/^(?:\d{10}|\d{13})$/, 'ISBN must be 10 or 13 digits')
  .brand<'ISBN'>();

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  authors: z.array(z.string()),
  seriesId: z.string().uuid().nullable(),
  seriesIndex: z.number().int().nullable(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  expectedReleaseDate: z.string().datetime().nullable(),
});

export const bookEditionSchema = z.object({
  id: z.string().uuid(),
  bookId: z.string().uuid(),
  isbn10: z.string().nullable(),
  isbn13: z.string().nullable(),
  publisher: z.string().nullable(),
  publishedAt: z.string().datetime().nullable(),
  pageCount: z.number().int().nullable(),
  coverUrl: z.string().url().nullable(),
  format: z.enum(['hardcover', 'paperback', 'ebook', 'audiobook']).nullable(),
});

export const readingStatusSchema = z.enum(['to_read', 'reading', 'completed', 'abandoned']);

export const scanRequestSchema = z.object({
  scanType: z.enum(['isbn_barcode', 'cover_image', 'manual']),
  payload: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type Book = z.infer<typeof bookSchema>;
export type BookEdition = z.infer<typeof bookEditionSchema>;
export type ReadingStatus = z.infer<typeof readingStatusSchema>;
export type ScanRequest = z.infer<typeof scanRequestSchema>;
