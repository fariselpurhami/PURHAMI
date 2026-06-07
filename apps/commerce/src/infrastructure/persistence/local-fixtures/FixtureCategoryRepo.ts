// apps/commerce/src/infrastructure/persistence/local-fixtures/FixtureCategoryRepo.ts
import { ICategoryRepository, Category } from '@purhami/domain';

export class FixtureCategoryRepo implements ICategoryRepository {
  async findTree(): Promise<Category[]> {
    return [
      Category.create('cat_1', { slug: 'accessories', name: 'Accessories', order: 0 }),
      Category.create('cat_2', { slug: 'essentials', name: 'Essentials', order: 1 })
    ];
  }
  
  async findById(id: string): Promise<Category | null> { return null; }
}
