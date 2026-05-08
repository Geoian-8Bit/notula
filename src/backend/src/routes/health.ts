import type { FastifyInstance } from 'fastify';
import { sql } from 'drizzle-orm';
import { db } from '../db/index.js';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ status: 'ok', uptime: process.uptime() }));

  app.get('/health/live', async () => ({ status: 'live' }));

  app.get('/health/ready', async (_req, reply) => {
    try {
      await db.execute(sql`select 1`);
      return { status: 'ready', deps: { database: 'ok' } };
    } catch (err) {
      app.log.error({ err }, 'health/ready: database check failed');
      return reply.code(503).send({ status: 'not_ready', deps: { database: 'fail' } });
    }
  });
}
