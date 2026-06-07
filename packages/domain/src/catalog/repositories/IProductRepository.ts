// packages/domain/src/catalog/repositories/IProductRepository.ts
import { Product } from '../entities/Product';
import { Variant } from '../entities/Variant'; // استيراد كائن الـ Variant لإصلاح الـ Type Contract

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findByCategory(categoryId: string): Promise<Product[]>;
  
  // إضافة الميثود المفقودة التي يستدعيها الـ AddItemToCartCommand
  findVariantById(variantId: string): Promise<Variant | null>;
}
