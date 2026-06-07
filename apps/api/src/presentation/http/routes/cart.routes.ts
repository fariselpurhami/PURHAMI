import { FastifyInstance } from 'fastify';

const COMMERCE_SERVICE_URL = 'http://localhost:4001/internal/v1/carts';

export async function cartRoutes(app: FastifyInstance) {
  // واجهة الـ API العامة للـ Web
  app.post('/:cartId/items', async (request, reply) => {
    const { cartId } = request.params as { cartId: string };

    try {
      const response = await fetch(`${COMMERCE_SERVICE_URL}/${cartId}/items`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-request-id': request.headers['x-request-id'] as string || ''
        },
        body: JSON.stringify(request.body),
      });

      const data = await response.json();

      if (!response.ok) {
        return reply.status(response.status).send(data);
      }

      return reply.status(200).send(data);
    } catch (error) {
      app.log.error(error);
      return reply.status(503).send({ error: 'Commerce Service Unavailable' });
    }
  });
}
