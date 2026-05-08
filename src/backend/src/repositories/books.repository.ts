import { eq, or } from 'drizzle-orm';
import { db, schema, type Database } from '../db/index.js';

export type BookRow = typeof schema.books.$inferSelect;
export type BookEditionRow = typeof schema.bookEditions.$inferSelect;
export type BookEditionWithBook = BookEditionRow & { book: BookRow };

type Executor = Database;

export const booksRepository = {
  async listCatalog(opts?: { limit?: number; tx?: Executor }): Promise<BookRow[]> {
    const exec = opts?.tx ?? db;
    return exec
      .select()
      .from(schema.books)
      .limit(opts?.limit ?? 50);
  },

  async findEditionByIsbn(
    isbn: string,
    opts?: { tx?: Executor },
  ): Promise<BookEditionWithBook | undefined> {
    const exec = opts?.tx ?? db;
    const rows = await exec.query.bookEditions.findMany({
      where: (t) => or(eq(t.isbn10, isbn), eq(t.isbn13, isbn)),
      with: { book: true },
      limit: 1,
    });
    return rows[0];
  },
};
