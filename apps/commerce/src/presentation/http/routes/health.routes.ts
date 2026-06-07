// apps/commerce/src/presentation/http/routes/health.routes.ts
import { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/liveness', async (_, reply) => {
    return reply.status(200).send({ status: 'ok', service: 'commerce' });
  });
}
