import { config } from 'dotenv';
import path from 'node:path';

config({ path: path.resolve(process.cwd(), '../../.env') });

if (!process.env.BETTER_AUTH_SECRET) {
  process.env.BETTER_AUTH_SECRET = 'test-secret-must-be-at-least-32-characters-long';
}
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgres://notula:notula@localhost:5432/notula';
}

export async function setup() {
  const { migrateDb, closeDb } = await import('../db/index.js');
  await migrateDb();
  await closeDb();
}

export async function teardown() {
  // Worker processes own their own DB clients and close them via afterAll hooks.
}
