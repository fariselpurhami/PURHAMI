// apps/api/tests/unit/aggregators.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CatalogAggregator } from '../../src/application/aggregators/CatalogAggregator';

// Mock the network layer to isolate aggregator logic
vi.mock('../../src/infrastructure/downstream/CommerceAdapter', () => ({
  fetchFromCommerce: vi.fn(),
}));

import { fetchFromCommerce } from '../../src/infrastructure/downstream/CommerceAdapter';

describe('Catalog Aggregator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when commerce downstream responds with 404', async () => {
    (fetchFromCommerce as any).mockResolvedValue({ status: 404 });
    const result = await CatalogAggregator.getProductAggregate('missing-id');
    expect(result).toBeNull();
  });

  it('throws CONTRACT_MISMATCH when downstream payload violates schema', async () => {
    (fetchFromCommerce as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: '123', title: 'Missing variants array' }), // Invalid according to ProductSchema
    });

    await expect(CatalogAggregator.getProductAggregate('123')).rejects.toThrow('CONTRACT_MISMATCH');
  });

  it('resolves valid payloads through strict Zod parsing', async () => {
    const validPayload = {
      id: '123',
      title: 'Valid Product',
      vendor: 'PURHAMI',
      descriptionHtml: '<p>Test</p>',
      variants: [],
      images: []
    };

    (fetchFromCommerce as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => validPayload,
    });

    const result = await CatalogAggregator.getProductAggregate('123');
    expect(result?.id).toBe('123');
  });
});
