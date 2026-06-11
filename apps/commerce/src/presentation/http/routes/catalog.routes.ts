// apps/commerce/src/presentation/http/routes/catalog.routes.ts
import { FastifyInstance } from 'fastify';
import { GetProductByIdQuery } from '../../../application/queries/GetProductByIdQuery';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function catalogRoutes(app: FastifyInstance) {
  app.get('/products', async (request, reply) => {
    try {
      const products = await prisma.product.findMany({
        include: { variants: true, categories: true, images: true }
      });
      return reply.status(200).send(products);
    } catch (error: any) {
      request.log.error(error);
      
      // 🚀 التحديث: إرسال تفاصيل الخطأ الفعلي من Prisma للواجهة لتسهيل الـ Debugging
      return reply.status(500).send({ 
        error: 'Database query failed',
        details: error.message || 'Unknown Prisma error'
      });
    }
  });

  app.get('/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const productDTO = await GetProductByIdQuery.execute(id);
    return reply.status(200).send(productDTO);
  });
}
