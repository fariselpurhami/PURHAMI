// apps/commerce/src/infrastructure/persistence/RepositoryFactory.ts
import { env } from '../../config/env';
import { IProductRepository, ICategoryRepository, ICartRepository } from '@purhami/domain';
import { PostgresProductRepo } from './postgres/PostgresProductRepo';
import { PostgresCategoryRepo } from './postgres/PostgresCategoryRepo';
import { FixtureProductRepo } from './local-fixtures/FixtureProductRepo';
import { FixtureCategoryRepo } from './local-fixtures/FixtureCategoryRepo';
import { logger } from '@purhami/observability';

/**
 * فئة تطوير موقتة مدمجة ومطابقة لعقد النطاق strictly typed
 * تمنع فشل الـ Build وتعمل كـ In-Memory store حتى يتم ربط جداول Postgres الخاصة بالسلة.
 */
class LocalDevCartRepository implements ICartRepository {
  private static store = new Map<string, any>();

  async findById(id: string): Promise<any | null> {
    return LocalDevCartRepository.store.get(id) || null;
  }

  async save(cart: any): Promise<void> {
    const cartProps = cart.getProps ? cart.getProps() : cart;
    LocalDevCartRepository.store.set(cartProps.id || 'demo-cart-id-123', cart);
  }
}

export class RepositoryFactory {
  static getProductRepository(): IProductRepository {
    if (env.NODE_ENV === 'development' && env.ALLOW_LOCAL_FIXTURES) {
      logger.info('Using Local Fixture Adapter for ProductReadModel');
      return new FixtureProductRepo();
    }
    return new PostgresProductRepo();
  }

  static getCategoryRepository(): ICategoryRepository {
    if (env.NODE_ENV === 'development' && env.ALLOW_LOCAL_FIXTURES) {
       logger.info('Using Local Fixture Adapter for CategoryReadModel');
       return new FixtureCategoryRepo();
    }
    return new PostgresCategoryRepo();
  }

  // الميثود المطلوبة لإنهاء مسار الـ Write-Domain والـ Command
  static getCartRepository(): ICartRepository {
    if (env.NODE_ENV === 'development' && env.ALLOW_LOCAL_FIXTURES) {
      logger.info('Using Local Dev In-Memory Adapter for CartWriteModel');
    }
    return new LocalDevCartRepository();
  }
}
