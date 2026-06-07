// apps/commerce/tests/application/queries.spec.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GetProductByIdQuery } from '../../src/application/queries/GetProductByIdQuery';
import { GetMegaMenuQuery } from '../../src/application/queries/GetMegaMenuQuery';
import { ProductNotFoundError, PersistenceNotConnectedError } from '@purhami/domain';
import { env } from '../../src/config/env';

describe('Commerce Application Queries', () => {
  const originalEnv = env.ALLOW_LOCAL_FIXTURES;

  afterEach(() => {
    // Restore environment state
    env.ALLOW_LOCAL_FIXTURES = originalEnv;
  });

  describe('Strict Persistence Posture (ALLOW_LOCAL_FIXTURES = false)', () => {
    beforeEach(() => {
      env.ALLOW_LOCAL_FIXTURES = false;
    });

    it('GetProductByIdQuery explicitly throws PersistenceNotConnectedError', async () => {
      await expect(GetProductByIdQuery.execute('fix_123'))
        .rejects
        .toThrowError(PersistenceNotConnectedError);
    });

    it('GetMegaMenuQuery explicitly throws PersistenceNotConnectedError', async () => {
      await expect(GetMegaMenuQuery.execute())
        .rejects
        .toThrowError(PersistenceNotConnectedError);
    });
  });

  describe('Local Fixture Posture (ALLOW_LOCAL_FIXTURES = true)', () => {
    beforeEach(() => {
      env.ALLOW_LOCAL_FIXTURES = true;
    });

    it('GetProductByIdQuery retrieves and maps the fixture correctly', async () => {
      const result = await GetProductByIdQuery.execute('fix_123');
      
      expect(result.id).toBe('fix_123');
      expect(result.title).toBe('Signature Oxblood Tote');
      expect(result.variants.length).toBe(1);
      expect(result.variants[0].price).toBe('$850.00'); // Validates Price value object formatting
      expect(result.variants[0].inventoryQuantity).toBe(15);
    });

    it('GetProductByIdQuery throws ProductNotFoundError for unknown fixture ID', async () => {
      await expect(GetProductByIdQuery.execute('unknown_123'))
        .rejects
        .toThrowError(ProductNotFoundError);
    });

    it('GetMegaMenuQuery retrieves and maps the category tree', async () => {
      const result = await GetMegaMenuQuery.execute();
      
      expect(result.groups.length).toBe(2);
      expect(result.groups[0].title).toBe('Accessories');
      expect(result.groups[1].title).toBe('Essentials');
    });
  });
});
