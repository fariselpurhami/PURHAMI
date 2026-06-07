// apps/commerce/src/infrastructure/persistence/postgres/PostgresCategoryRepo.ts
import { ICategoryRepository, Category, PersistenceNotConnectedError } from '@purhami/domain';

export class PostgresCategoryRepo implements ICategoryRepository {
  async findTree(): Promise<Category[]> {
    throw new PersistenceNotConnectedError('PostgresCategoryRepo');
  }

  async findById(id: string): Promise<Category | null> {
    throw new PersistenceNotConnectedError('PostgresCategoryRepo');
  }
}
