// apps/api/src/presentation/http/routes/catalog.routes.ts
import { FastifyInstance } from 'fastify';
import { CatalogAggregator } from '../../../application/aggregators/CatalogAggregator';
import { getCorrelationId } from '@purhami/observability';

export async function catalogRoutes(app: FastifyInstance) {
  app.get('/products', async (request, reply) => {
    try {
      const commerceResponse = await fetch('http://localhost:4001/internal/v1/catalog/products');
      const products = await commerceResponse.json();
      
      // التعديل هنا: نبعت المصفوفة مباشرة بدون غلاف { success: true, data: ... }
      return reply.status(200).send(products); 
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Commerce Service Unavailable' });
    }
  });

  app.get('/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const product = await CatalogAggregator.getProductAggregate(id);

    if (!product) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Product not found', correlationId: getCorrelationId() }
      });
    }
    return reply.status(200).send(product); // نفس الفكرة هنا، نبعت المنتج مباشرة
  });
}
