import type { FastifyInstance } from 'fastify';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth/config.js';

export async function registerAuth(app: FastifyInstance) {
  app.route({
    method: ['GET', 'POST'],
    url: '/api/auth/*',
    handler: async (request, reply) => {
      const url = new URL(request.url, `http://${request.headers.host ?? 'localhost'}`);
      const headers = fromNodeHeaders(request.headers);
      const init: RequestInit = {
        method: request.method,
        headers,
      };
      if (request.method !== 'GET' && request.method !== 'HEAD' && request.body) {
        init.body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body);
        if (!headers.has('content-type')) {
          headers.set('content-type', 'application/json');
        }
      }
      const response = await auth.handler(new Request(url.toString(), init));
      reply.status(response.status);
      response.headers.forEach((value, key) => {
        reply.header(key, value);
      });
      const text = await response.text();
      return reply.send(text || null);
    },
  });
}
