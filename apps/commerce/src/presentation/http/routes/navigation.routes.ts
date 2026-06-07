// apps/commerce/src/presentation/http/routes/navigation.routes.ts
import { FastifyInstance } from 'fastify';
import { GetMegaMenuQuery } from '../../../application/queries/GetMegaMenuQuery';

export async function navigationRoutes(app: FastifyInstance) {
  app.get('/navigation', async (request, reply) => {
    const menuDTO = await GetMegaMenuQuery.execute();
    return reply.status(200).send(menuDTO);
  });
}
