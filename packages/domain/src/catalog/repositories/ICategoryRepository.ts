// packages/domain/src/catalog/repositories/ICategoryRepository.ts
import { Category } from '../entities/Category';

export interface ICategoryRepository {
  findTree(): Promise<Category[]>; // Returns taxonomy for the MegaMenu
  findById(id: string): Promise<Category | null>;
}
