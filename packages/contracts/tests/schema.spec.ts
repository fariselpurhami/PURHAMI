// packages/contracts/tests/schema.spec.ts
import { describe, it, expect } from 'vitest';
import { ProductSchema, MoneySchema } from '../src';

describe('Zero-Mock Integration Contracts', () => {
  it('rejects improperly formatted money contracts', () => {
    const invalidMoney = {
      amount: 100, // Should be string
      currencyCode: 'US', // Should be length 3
    };
    
    const result = MoneySchema.safeParse(invalidMoney);
    expect(result.success).toBe(false);
  });

  it('validates a complete product schema safely', () => {
    const validProduct = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      slug: 'oxblood-leather-tote',
      title: 'Oxblood Leather Tote',
      descriptionHtml: '<p>Details</p>',
      variants: [],
      images: [],
      vendor: 'PURHAMI',
    };

    const result = ProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });
});
