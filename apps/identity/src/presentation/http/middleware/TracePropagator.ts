// apps/identity/src/presentation/http/middleware/TracePropagator.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { runWithTrace, logger } from '@purhami/observability';
import { randomUUID } from 'node:crypto';

export function setupTracePropagator(app: FastifyInstance) {
  app.addHook('onRequest', (request: FastifyRequest, reply: FastifyReply, done) => {
    const headerId = request.headers['x-request-id'] as string;
    const correlationId = headerId || randomUUID();
    
    runWithTrace(correlationId, () => {
      // Intentionally omitting path to prevent logging sensitive route paths directly
      logger.info({ method: request.method }, 'Handling Internal Identity Request');
      done();
    });
  });
}
