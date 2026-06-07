// apps/commerce/src/infrastructure/persistence/local-fixtures/FixtureProductRepo.ts
import { IProductRepository, Product, Variant, Price, InventoryLevel } from '@purhami/domain';

export class FixtureProductRepo implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    // Only return a fixture for a specific known ID during local testing
    if (id !== 'fix_123') return null;

    const variant = Variant.create('var_1', {
      sku: 'PRH-OXB-01',
      title: 'Default',
      price: Price.create(85000, 'USD'),
      inventory: InventoryLevel.create(15, 5),
      options: { Color: 'Oxblood' }
    });

    return Product.create('fix_123', {
      slug: 'signature-oxblood-tote',
      title: 'Signature Oxblood Tote',
      vendor: 'PURHAMI',
      descriptionHtml: '<p>A masterpiece of structural design.</p>',
      variants: [variant],
      images: [],
      categoryIds: ['cat_1']
    });
  }

  async findBySlug(slug: string): Promise<Product | null> { return null; }
  async findByCategory(categoryId: string): Promise<Product[]> { return []; }
  async findVariantById(variantId: string): Promise<any | null> {
    return null; // سيتم ربطها لاحقاً بـ Prisma/DB
  }
}
