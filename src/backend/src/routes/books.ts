import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db, schema } from '../db/index.js';

const isbnParamSchema = z.object({ isbn: z.string().min(10).max(13) });

export async function bookRoutes(app: FastifyInstance) {
  app.get('/books', {
    schema: {
      tags: ['books'],
      summary: 'List books in the catalog',
      response: { 200: z.object({ books: z.array(z.unknown()) }) },
    },
    handler: async () => {
      const rows = await db.select().from(schema.books).limit(50);
      return { books: rows };
    },
  });

  app.get('/books/by-isbn/:isbn', {
    schema: {
      tags: ['books'],
      summary: 'Look up a book edition by ISBN-10 or ISBN-13',
      params: isbnParamSchema,
    },
    handler: async (req, reply) => {
      const { isbn } = isbnParamSchema.parse(req.params);
      const rows = await db.query.bookEditions.findMany({
        where: (t, { or, eq }) => or(eq(t.isbn10, isbn), eq(t.isbn13, isbn)),
        with: { book: true },
        limit: 1,
      });
      const found = rows[0];
      if (!found) return reply.code(404).send({ error: 'edition_not_found' });
      return found;
    },
  });
}
