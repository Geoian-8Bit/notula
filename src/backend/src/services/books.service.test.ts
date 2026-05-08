import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../repositories/books.repository.js', () => ({
  booksRepository: {
    listCatalog: vi.fn(),
    findEditionByIsbn: vi.fn(),
  },
}));

import { booksService } from './books.service.js';
import { booksRepository } from '../repositories/books.repository.js';
import { AppError } from '../lib/errors.js';

const repoMock = vi.mocked(booksRepository);

describe('booksService.listCatalog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps drizzle Date fields to ISO strings', async () => {
    const release = new Date('2026-09-15T00:00:00.000Z');
    repoMock.listCatalog.mockResolvedValueOnce([
      {
        id: '11111111-1111-1111-1111-111111111111',
        title: 'A Memory Called Empire',
        authors: ['Arkady Martine'],
        seriesId: null,
        seriesIndex: null,
        description: null,
        language: 'en',
        metadata: null,
        expectedReleaseDate: release,
        createdAt: new Date(),
      },
    ]);
    const result = await booksService.listCatalog();
    expect(result).toHaveLength(1);
    const book = result[0];
    if (!book) throw new Error('expected one book');
    expect(book.expectedReleaseDate).toBe(release.toISOString());
    expect(book).not.toHaveProperty('metadata');
    expect(book).not.toHaveProperty('createdAt');
  });

  it('returns an empty list when the repository has no rows', async () => {
    repoMock.listCatalog.mockResolvedValueOnce([]);
    expect(await booksService.listCatalog()).toEqual([]);
  });
});

describe('booksService.findEditionByIsbn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws a 404 AppError when no edition matches', async () => {
    repoMock.findEditionByIsbn.mockResolvedValueOnce(undefined);
    await expect(() => booksService.findEditionByIsbn('9999999999999')).rejects.toMatchObject({
      statusCode: 404,
      code: 'not_found',
    });
    await expect(() => booksService.findEditionByIsbn('9999999999999')).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('returns the edition with its book when matched', async () => {
    const published = new Date('2019-03-26T00:00:00.000Z');
    repoMock.findEditionByIsbn.mockResolvedValueOnce({
      id: '22222222-2222-2222-2222-222222222222',
      bookId: '11111111-1111-1111-1111-111111111111',
      isbn10: null,
      isbn13: '9781250186430',
      publisher: 'Tor',
      publishedAt: published,
      pageCount: 462,
      coverUrl: 'https://example.com/cover.jpg',
      format: 'hardcover',
      metadata: null,
      createdAt: new Date(),
      book: {
        id: '11111111-1111-1111-1111-111111111111',
        title: 'A Memory Called Empire',
        authors: ['Arkady Martine'],
        seriesId: null,
        seriesIndex: null,
        description: null,
        language: 'en',
        metadata: null,
        expectedReleaseDate: null,
        createdAt: new Date(),
      },
    });
    const result = await booksService.findEditionByIsbn('9781250186430');
    expect(result.edition.publishedAt).toBe(published.toISOString());
    expect(result.book.title).toBe('A Memory Called Empire');
  });
});
