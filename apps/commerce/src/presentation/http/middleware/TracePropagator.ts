import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { runWithTrace, logger } from '@purhami/observability';
import { randomUUID } from 'node:crypto';

export function setupTracePropagator(app: FastifyInstance) {
  app.addHook('onRequest', (request: FastifyRequest, reply: FastifyReply, done) => {
    const headerId = request.headers['x-request-id'] as string;
    
    if (!headerId) {
      logger.warn({ url: request.url }, 'Request missing correlation ID from API Gateway. Regenerating.');
    }

    const correlationId = headerId || randomUUID();
    
    runWithTrace(correlationId, () => {
      logger.info({ method: request.method, url: request.url }, 'Handling Internal Commerce Request');
      done();
    });
  });
}
