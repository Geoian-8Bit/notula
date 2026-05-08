import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { corsOrigins } from '../config/env.js';

export async function registerCors(app: FastifyInstance) {
  await app.register(cors, {
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
}
