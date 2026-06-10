// apps/commerce/src/infrastructure/persistence/RepositoryFactory.ts
import { IProductRepository, ICategoryRepository, ICartRepository } from '@purhami/domain';
import { PostgresProductRepo } from './postgres/PostgresProductRepo';
import { PostgresCategoryRepo } from './postgres/PostgresCategoryRepo';
import { PostgresCartRepo } from './postgres/PostgresCartRepo';
import { PrismaClient } from '@prisma/client';
import { logger } from '@purhami/observability';

const prismaClient = new PrismaClient();

export class RepositoryFactory {
  static getProductRepository(): IProductRepository {
    logger.info('🏢 Connected to Postgres for ProductReadModel');
    return new PostgresProductRepo(prismaClient);
  }

  static getCategoryRepository(): ICategoryRepository {
    logger.info('🏢 Connected to Postgres for CategoryReadModel');
    return new PostgresCategoryRepo(prismaClient);
  }

  static getCartRepository(): ICartRepository {
    logger.info('🛒 Connected to Postgres for CartWriteModel');
    return new PostgresCartRepo(prismaClient);
  }
}
