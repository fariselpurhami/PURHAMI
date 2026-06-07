import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AddItemToCartCommand } from '../../../application/commands/AddItemToCartCommand';

const AddItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export async function cartRoutes(app: FastifyInstance) {
  // مسار داخلي لإضافة منتج للسلة
  app.post('/:cartId/items', async (request, reply) => {
    const { cartId } = request.params as { cartId: string };
    const parsed = AddItemSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid payload' });
    }

    // سيتم التقاط الأخطاء (مثل INSUFFICIENT_INVENTORY) بواسطة الـ Error Handler
    await AddItemToCartCommand.execute(cartId, parsed.data.variantId, parsed.data.quantity);

    return reply.status(200).send({ success: true, message: 'Item added to cart' });
  });
}
