import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  name: text('name').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('sessions_user_idx').on(t.userId),
  }),
);

export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('accounts_user_idx').on(t.userId),
  }),
);

export const verifications = pgTable(
  'verifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    identifierIdx: index('verifications_identifier_idx').on(t.identifier),
  }),
);

export const bookSeries = pgTable('book_series', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  totalPlanned: integer('total_planned'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const books = pgTable(
  'books',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    authors: text('authors').array().notNull().default([]),
    seriesId: uuid('series_id').references(() => bookSeries.id, { onDelete: 'set null' }),
    seriesIndex: integer('series_index'),
    description: text('description'),
    language: text('language'),
    metadata: jsonb('metadata'),
    expectedReleaseDate: timestamp('expected_release_date', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    seriesIdx: index('books_series_idx').on(t.seriesId),
  }),
);

export const bookEditions = pgTable(
  'book_editions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    bookId: uuid('book_id')
      .notNull()
      .references(() => books.id, { onDelete: 'cascade' }),
    isbn10: text('isbn10'),
    isbn13: text('isbn13'),
    publisher: text('publisher'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    pageCount: integer('page_count'),
    coverUrl: text('cover_url'),
    format: text('format'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    isbnIdx: index('book_editions_isbn13_idx').on(t.isbn13),
    bookIdx: index('book_editions_book_idx').on(t.bookId),
  }),
);

export const userLibrary = pgTable(
  'user_library',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    editionId: uuid('edition_id')
      .notNull()
      .references(() => bookEditions.id, { onDelete: 'cascade' }),
    acquiredAt: timestamp('acquired_at', { withTimezone: true }).notNull().defaultNow(),
    ownsPhysical: boolean('owns_physical').notNull().default(false),
    notes: text('notes'),
  },
  (t) => ({
    userEditionIdx: index('user_library_user_edition_idx').on(t.userId, t.editionId),
  }),
);

export const readingProgress = pgTable('reading_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  editionId: uuid('edition_id')
    .notNull()
    .references(() => bookEditions.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('to_read'),
  currentPage: integer('current_page'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
  rating: integer('rating'),
  review: text('review'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const bookFiles = pgTable('book_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  editionId: uuid('edition_id')
    .notNull()
    .references(() => bookEditions.id, { onDelete: 'cascade' }),
  fileType: text('file_type').notNull(),
  storageKey: text('storage_key').notNull(),
  sizeBytes: integer('size_bytes'),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
});

export const scanLogs = pgTable('scan_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  scannedCode: text('scanned_code'),
  scanType: text('scan_type').notNull(),
  resolvedEditionId: uuid('resolved_edition_id').references(() => bookEditions.id, {
    onDelete: 'set null',
  }),
  rawResponse: jsonb('raw_response'),
  source: text('source'),
  scannedAt: timestamp('scanned_at', { withTimezone: true }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  library: many(userLibrary),
  readingProgress: many(readingProgress),
  files: many(bookFiles),
  scanLogs: many(scanLogs),
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const bookSeriesRelations = relations(bookSeries, ({ many }) => ({
  books: many(books),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  series: one(bookSeries, { fields: [books.seriesId], references: [bookSeries.id] }),
  editions: many(bookEditions),
}));

export const bookEditionsRelations = relations(bookEditions, ({ one, many }) => ({
  book: one(books, { fields: [bookEditions.bookId], references: [books.id] }),
  ownedBy: many(userLibrary),
  files: many(bookFiles),
  progress: many(readingProgress),
}));

export const userLibraryRelations = relations(userLibrary, ({ one }) => ({
  user: one(users, { fields: [userLibrary.userId], references: [users.id] }),
  edition: one(bookEditions, { fields: [userLibrary.editionId], references: [bookEditions.id] }),
}));

export const readingProgressRelations = relations(readingProgress, ({ one }) => ({
  user: one(users, { fields: [readingProgress.userId], references: [users.id] }),
  edition: one(bookEditions, {
    fields: [readingProgress.editionId],
    references: [bookEditions.id],
  }),
}));

export const bookFilesRelations = relations(bookFiles, ({ one }) => ({
  user: one(users, { fields: [bookFiles.userId], references: [users.id] }),
  edition: one(bookEditions, { fields: [bookFiles.editionId], references: [bookEditions.id] }),
}));

export const scanLogsRelations = relations(scanLogs, ({ one }) => ({
  user: one(users, { fields: [scanLogs.userId], references: [users.id] }),
  resolvedEdition: one(bookEditions, {
    fields: [scanLogs.resolvedEditionId],
    references: [bookEditions.id],
  }),
}));
