import { FastifyInstance } from 'fastify';

const COMMERCE_SERVICE_URL = 'http://localhost:4001/internal/v1/carts';

export async function cartRoutes(app: FastifyInstance) {
  
  // 1. مسار جلب السلة (Read Flow)
  app.get('/:cartId', async (request, reply) => {
    const { cartId } = request.params as { cartId: string };

    try {
      const response = await fetch(`${COMMERCE_SERVICE_URL}/${cartId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-request-id': request.headers['x-request-id'] as string || ''
        }
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

  // 2. واجهة الـ API العامة لإضافة عناصر للسلة (Write Flow)
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

  // 3. 🗑️ مسار حذف منتج من السلة (Delete Flow - التحديث الجديد)
  app.delete('/:cartId/items/:itemId', async (request, reply) => {
    const { cartId, itemId } = request.params as { cartId: string; itemId: string };

    try {
      const response = await fetch(`${COMMERCE_SERVICE_URL}/${cartId}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          // شيلنا Content-Type: application/json عشان الـ Delete مش محتاج Body
          'x-request-id': request.headers['x-request-id'] as string || ''
        }
      });

      // لو مفيش body راجع من السيرفر الداخلي، نكتفي بالـ status
      if (response.status === 204) return reply.status(204).send();

      const data = await response.json();
      return reply.status(response.status).send(data);
    } catch (error) {
      app.log.error(error);
      return reply.status(503).send({ error: 'Commerce Service Unavailable' });
    }
  });
}
