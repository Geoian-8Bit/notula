import type { FastifyReply, FastifyRequest } from 'fastify';
import { fromNodeHeaders } from 'better-auth/node';
import { auth, type Session } from './config.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: Session['user'];
    session?: Session['session'];
  }
}

export async function requireUser(req: FastifyRequest, reply: FastifyReply) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) {
    return reply.code(401).send({ error: 'unauthorized', message: 'Authentication required' });
  }
  req.user = session.user;
  req.session = session.session;
}
