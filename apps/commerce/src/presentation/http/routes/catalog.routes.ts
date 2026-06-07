// apps/commerce/src/presentation/http/routes/catalog.routes.ts
import { FastifyInstance } from 'fastify';
import { GetProductByIdQuery } from '../../../application/queries/GetProductByIdQuery';

export async function catalogRoutes(app: FastifyInstance) {
  app.get('/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    // Domain/App layer will throw if missing or if DB not connected. Error handler catches it.
    const productDTO = await GetProductByIdQuery.execute(id);
    
    return reply.status(200).send(productDTO);
  });
}
