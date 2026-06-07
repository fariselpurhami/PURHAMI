// packages/domain/tests/catalog.spec.ts
import { describe, it, expect } from 'vitest';
import { Product } from '../src/catalog/entities/Product';
import { Variant } from '../src/catalog/entities/Variant';
import { Price } from '../src/catalog/value-objects/Price';
import { InventoryLevel } from '../src/catalog/value-objects/InventoryLevel';

describe('Catalog Domain Logic', () => {
  it('prevents creation of a product without variants', () => {
    expect(() => {
      Product.create('prod_123', {
        slug: 'test',
        title: 'Test',
        vendor: 'PURHAMI',
        descriptionHtml: '<p>Test</p>',
        variants: [], // Illegal state
        images: [],
        categoryIds: []
      });
    }).toThrow('A product must have at least one variant.');
  });

  it('correctly maps inventory status', () => {
    const outOfStock = InventoryLevel.create(0);
    const lowStock = InventoryLevel.create(2, 5);
    const inStock = InventoryLevel.create(10, 5);

    expect(outOfStock.getStatus()).toBe('OUT_OF_STOCK');
    expect(lowStock.getStatus()).toBe('LOW_STOCK');
    expect(inStock.getStatus()).toBe('IN_STOCK');
  });

  it('formats prices correctly based on currency', () => {
    const usd = Price.create(15000, 'USD'); // $150.00
    expect(usd.format()).toBe('$150.00');
  });
});
