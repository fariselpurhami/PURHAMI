// apps/commerce/src/infrastructure/persistence/postgres/PostgresProductRepo.ts
import { IProductRepository, Product } from '@purhami/domain';
import { PrismaClient } from '@prisma/client';
import { logger } from '@purhami/observability';

export class PostgresProductRepo implements IProductRepository {
  // استقبال الـ PrismaClient من الـ RepositoryFactory
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<any | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: { variants: true, images: true, categories: true }
    });
  }

  async findBySlug(slug: string): Promise<any | null> {
    return this.prisma.product.findUnique({
      where: { slug },
      include: { variants: true, images: true, categories: true }
    });
  }

  async findByCategory(categoryId: string): Promise<any[]> {
    return this.prisma.product.findMany({
      where: { categories: { some: { id: categoryId } } },
      include: { variants: true, images: true, categories: true }
    });
  }

  // 🚀 الدالة اللي كانت عاملة الأزمة: دلوقتي بتقرأ من Postgres بجد
  async findVariantById(variantId: string): Promise<any | null> {
    logger.info({ variantId }, 'Querying Postgres for variant...');
    
    const variant = await this.prisma.variant.findUnique({
      where: { id: variantId },
      include: {
        product: true // جلب تفاصيل المنتج الأساسي مع المتغير
      }
    });
    
    if (!variant) {
      logger.warn({ variantId }, 'Variant not found in Postgres database.');
    }
    
    return variant;
  }
}
