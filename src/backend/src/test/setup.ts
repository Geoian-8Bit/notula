import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (!process.env.BETTER_AUTH_SECRET) {
  process.env.BETTER_AUTH_SECRET = 'test-secret-must-be-at-least-32-characters-long';
}
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgres://notula:notula@localhost:5432/notula';
}

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.resolve(here, '../../drizzle/migrations');

export async function setup() {
  const { db, closeDb } = await import('../db/index.js');
  await migrate(db, { migrationsFolder });
  await closeDb();
}

export async function teardown() {
  // Worker processes own their own DB clients and close them via afterAll hooks.
}
