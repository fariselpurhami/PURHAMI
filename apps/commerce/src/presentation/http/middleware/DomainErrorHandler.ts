import { FastifyInstance } from 'fastify';
import { logger, getCorrelationId } from '@purhami/observability';
import { ProductNotFoundError, PersistenceNotConnectedError } from '@purhami/domain';

export function setupDomainErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    const correlationId = getCorrelationId();
    
    if (error instanceof ProductNotFoundError) {
      return reply.status(404).send({ error: error.message, correlationId });
    }

    if (error instanceof PersistenceNotConnectedError) {
      logger.error({ err: error }, 'Critical Persistence Failure');
      return reply.status(503).send({ error: error.message, correlationId }); 
    }

    logger.error({ err: error }, 'Unhandled Commerce Exception');
    return reply.status(500).send({ error: 'Internal Server Error', correlationId });
  });
}
