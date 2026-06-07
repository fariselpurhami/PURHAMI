// apps/api/src/presentation/http/middleware/GlobalErrorHandler.ts
import { FastifyInstance } from 'fastify';
import { logger, getCorrelationId } from '@purhami/observability';

export function setupGlobalErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    const correlationId = getCorrelationId();
    
    logger.error({ err: error }, 'Unhandled API Exception');

    if (error.message === 'CONTRACT_MISMATCH') {
      return reply.status(502).send({
        success: false,
        error: { code: 'CONTRACT_MISMATCH', message: 'Upstream payload schema violation', correlationId }
      });
    }

    return reply.status(503).send({
      success: false,
      error: { code: 'UNAVAILABLE', message: 'Service temporarily unavailable', correlationId }
    });
  });
}
