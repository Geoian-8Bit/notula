import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { migrate as migratePostgres } from 'drizzle-orm/postgres-js/migrator';
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import postgres from 'postgres';
import { PGlite } from '@electric-sql/pglite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import * as schema from './schema.js';

const isPglite = /^(pglite:|file:)/i.test(env.DATABASE_URL);

type DrizzleClient =
  | ReturnType<typeof drizzlePostgres<typeof schema>>
  | ReturnType<typeof drizzlePglite<typeof schema>>;

function pgliteDataDir() {
  const stripped = env.DATABASE_URL.replace(/^(pglite:|file:)\/?\/?/i, '');
  return stripped || './local.pgdata';
}

let db: DrizzleClient;
let close: () => Promise<void>;
let runMigrations: (folder: string) => Promise<void>;

if (isPglite) {
  const client = new PGlite(pgliteDataDir());
  const pgliteDb = drizzlePglite(client, { schema, casing: 'snake_case' });
  db = pgliteDb;
  close = async () => {
    await client.close();
  };
  runMigrations = async (folder) => {
    await migratePglite(pgliteDb, { migrationsFolder: folder });
  };
} else {
  const queryClient = postgres(env.DATABASE_URL, {
    max: env.NODE_ENV === 'production' ? 10 : 5,
    prepare: false,
  });
  const pgDb = drizzlePostgres(queryClient, { schema, casing: 'snake_case' });
  db = pgDb;
  close = async () => {
    await queryClient.end({ timeout: 5 });
  };
  runMigrations = async (folder) => {
    await migratePostgres(pgDb, { migrationsFolder: folder });
  };
}

export { db, schema };
export type Database = typeof db;

export async function closeDb() {
  await close();
}

export async function migrateDb(folder?: string) {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const target = folder ?? path.resolve(here, '../../drizzle/migrations');
  await runMigrations(target);
}
