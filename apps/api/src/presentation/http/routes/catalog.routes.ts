// apps/api/src/presentation/http/routes/catalog.routes.ts
import { FastifyInstance } from 'fastify';
import { CatalogAggregator } from '../../../application/aggregators/CatalogAggregator';
import { getCorrelationId } from '@purhami/observability';

export async function catalogRoutes(app: FastifyInstance) {
  app.get('/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const product = await CatalogAggregator.getProductAggregate(id);

    if (!product) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Product not found', correlationId: getCorrelationId() }
      });
    }

    return reply.status(200).send({ success: true, data: product });
  });
}
