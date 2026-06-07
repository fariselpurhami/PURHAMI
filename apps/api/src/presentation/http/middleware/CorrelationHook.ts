// apps/api/src/presentation/http/middleware/CorrelationHook.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { runWithTrace, logger } from '@purhami/observability';
import { randomUUID } from 'node:crypto';

export function setupCorrelationHook(app: FastifyInstance) {
  app.addHook('onRequest', (request: FastifyRequest, reply: FastifyReply, done) => {
    const headerId = request.headers['x-request-id'] as string;
    const correlationId = headerId || randomUUID();
    
    // Inject the ID into the response for client tracking
    reply.header('x-request-id', correlationId);

    // Bind the correlation ID to the AsyncLocalStorage context for this specific request
    runWithTrace(correlationId, () => {
      logger.info({ method: request.method, url: request.url }, 'Incoming API Request');
      done();
    });
  });
}
