// packages/api-client/src/catalog/product.api.ts
import { Product, ProductSchema } from '@purhami/contracts';
import { executeCommerceFetch } from '../core/fetcher';
import { CACHE_POLICIES } from '../core/cache';
import { Result } from '../core/error';

export async function getProductById(id: string): Promise<Result<Product>> {
  return executeCommerceFetch<Product>({
    path: `/api/v1/catalog/products/${id}`,
    schema: ProductSchema,
    ...CACHE_POLICIES.CATALOG,
  });
}
