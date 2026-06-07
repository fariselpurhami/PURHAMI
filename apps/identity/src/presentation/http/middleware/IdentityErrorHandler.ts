// apps/identity/src/presentation/http/middleware/IdentityErrorHandler.ts
import { FastifyInstance } from 'fastify';
import { logger, getCorrelationId } from '@purhami/observability';

export function setupIdentityErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    const correlationId = getCorrelationId();
    
    if (error.message === 'INVALID_CREDENTIALS') {
      logger.warn({ ip: request.ip }, 'Failed authentication attempt');
      return reply.status(401).send({ error: 'Invalid email or password', correlationId });
    }

    if (error.message === 'INVALID_TOKEN') {
      return reply.status(401).send({ error: 'Token is expired or invalid', correlationId });
    }

    logger.error({ err: error }, 'Unhandled Identity Exception');
    return reply.status(500).send({ error: 'Internal Server Error', correlationId });
  });
}
