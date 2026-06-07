// apps/api/src/application/aggregators/CatalogAggregator.ts
import { fetchFromCommerce } from '../../infrastructure/downstream/CommerceAdapter';
import { Product, ProductSchema } from '@purhami/contracts';
import { logger } from '@purhami/observability';

export class CatalogAggregator {
  static async getProductAggregate(id: string): Promise<Product | null> {
    const response = await fetchFromCommerce(`/internal/v1/catalog/products/${id}`);
    
    if (response.status === 404) return null;
    
    if (!response.ok) {
      logger.error({ status: response.status }, 'Commerce service returned non-200');
      throw new Error('Commerce downstream unavailable');
    }

    const rawData = await response.json();
    
    // Strict schema enforcement before returning to the frontend
    const parsed = ProductSchema.safeParse(rawData);
    if (!parsed.success) {
      logger.error({ error: parsed.error.format() }, 'Commerce payload contract mismatch');
      throw new Error('CONTRACT_MISMATCH');
    }

    return parsed.data;
  }
}
