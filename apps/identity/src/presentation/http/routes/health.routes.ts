// apps/identity/src/presentation/http/routes/health.routes.ts
import { FastifyInstance } from 'fastify';
import { prisma } from '@purhami/persistence';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/liveness', async (_, reply) => {
    return reply.status(200).send({ status: 'ok', service: 'identity' });
  });

  app.get('/readiness', async (_, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return reply.status(200).send({ status: 'ready', database: 'connected' });
    } catch (e) {
      return reply.status(503).send({ status: 'degraded', database: 'disconnected' });
    }
  });
}
