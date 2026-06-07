// apps/commerce/src/infrastructure/persistence/postgres/PostgresProductRepo.ts
import { IProductRepository, Product, PersistenceNotConnectedError } from '@purhami/domain';
import { logger } from '@purhami/observability';

export class PostgresProductRepo implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    logger.warn('PostgresProductRepo called but database is not provisioned.');
    throw new PersistenceNotConnectedError('PostgresProductRepo');
  }

  async findBySlug(slug: string): Promise<Product | null> {
    throw new PersistenceNotConnectedError('PostgresProductRepo');
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    throw new PersistenceNotConnectedError('PostgresProductRepo');
  }
  // أضف هذه الدالة لإرضاء الـ IProductRepository
  async findVariantById(variantId: string): Promise<any | null> {
    return null; // سيتم ربطها لاحقاً بـ Prisma/DB
  }
}
