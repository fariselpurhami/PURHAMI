// apps/commerce/src/presentation/http/routes/catalog.routes.ts
import { FastifyInstance } from 'fastify';
import { GetProductByIdQuery } from '../../../application/queries/GetProductByIdQuery';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function catalogRoutes(app: FastifyInstance) {
  
  // 1. المسار الجديد اللي كان ناقص وبيعمل 404 (جلب كل المنتجات)
  app.get('/products', async (request, reply) => {
    try {
      const products = await prisma.product.findMany({
        include: { variants: true, categories: true, images: true }
      });
      // Fastify هيرجع المصفوفة مباشرة
      return reply.status(200).send(products);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Database query failed' });
    }
  });

  // 2. المسار القديم (جلب منتج واحد)
  app.get('/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const productDTO = await GetProductByIdQuery.execute(id);
    return reply.status(200).send(productDTO);
  });
}
