// apps/api/src/presentation/http/routes/health.routes.ts
import { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/liveness', async (_, reply) => {
    return reply.status(200).send({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/readiness', async (_, reply) => {
    // In a mature state, this pings downstreams/databases
    return reply.status(200).send({ status: 'ready', timestamp: new Date().toISOString() });
  });
}
