import { FastifyInstance } from 'fastify';
import { NavigationAggregator } from '../../../application/aggregators/NavigationAggregator';

export async function navigationRoutes(app: FastifyInstance) {
  app.get('/navigation', async (request, reply) => {
    const menu = await NavigationAggregator.getMegaMenuAggregate();
    return reply.status(200).send({ success: true, data: menu });
  });
}
