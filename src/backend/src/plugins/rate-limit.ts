import type { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';
import { env } from '../config/env.js';

export async function registerRateLimit(app: FastifyInstance) {
  await app.register(rateLimit, {
    max: env.NODE_ENV === 'production' ? 100 : 1000,
    timeWindow: '1 minute',
    allowList: ['127.0.0.1'],
  });
}
