import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AddItemToCartCommand } from '../../../application/commands/AddItemToCartCommand';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const AddItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export async function cartRoutes(app: FastifyInstance) {
  
  // 1. مسار القراءة (تمت ترقيته ليدمج الصور والأسعار)
  app.get('/:cartId', async (request, reply) => {
    const { cartId } = request.params as { cartId: string };
    
    try {
      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { items: true }
      });

      if (!cart) return reply.status(200).send({ id: cartId, items: [] });

      // 🌟 السحر المعماري: سحب تفاصيل المنتجات من الداتا بيز
      const enrichedItems = await Promise.all(cart.items.map(async (item) => {
        const variant = await prisma.variant.findUnique({
          where: { id: item.variantId },
          include: { product: { include: { images: true } } }
        });
        
        return {
          id: item.id,
          variantId: item.variantId,
          quantity: item.quantity,
          title: variant?.product?.title || variant?.title || 'Classified Item',
          sku: variant?.sku || 'N/A',
          price: variant?.priceAmount || 0,
          image: variant?.product?.images?.[0]?.url || '',
          options: variant?.options || {}
        };
      }));

      return reply.status(200).send({ id: cart.id, items: enrichedItems });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch cart' });
    }
  });

  // 2. مسار الإضافة (كما هو)
  app.post('/:cartId/items', async (request, reply) => {
    const { cartId } = request.params as { cartId: string };
    const parsed = AddItemSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid payload' });

    try {
      await AddItemToCartCommand.execute(cartId, parsed.data.variantId, parsed.data.quantity);
      return reply.status(200).send({ success: true });
    } catch (error: any) {
      app.log.error(error);
      return reply.status(400).send({ error: error.message });
    }
  });

  // 3. 🗑️ مسار الحذف (الجديد)

  // 🗑️ مسار الحذف النهائي من Postgres
  app.delete('/:cartId/items/:itemId', async (request, reply) => {
    const { cartId, itemId } = request.params as { cartId: string; itemId: string };
    try {
      const cartRepo = RepositoryFactory.getCartRepository();
      // الوصول السريع للحذف المباشر (لضمان اختفاء المنتج للأبد)
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      await prisma.cartItem.deleteMany({
        where: { id: itemId, cartId: cartId }
      });

      return reply.status(200).send({ success: true, message: 'Item permanently deleted' });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete item from Postgres' });
    }
  });
}
