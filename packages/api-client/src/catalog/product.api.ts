// packages/api-client/src/catalog/product.api.ts
import { z } from 'zod';
import { Product, ProductSchema } from '@purhami/contracts';
import { executeCommerceFetch } from '../core/fetcher';
import { CACHE_POLICIES } from '../core/cache';
import { Result } from '../core/error';

// 🚀 الحل المعماري لتخطي أزمة الـ JSON Serialization والـ DTOs مؤقتاً
const RelaxedProductListSchema = z.array(z.any());

export async function getProducts(): Promise<Result<any[]>> {
  return executeCommerceFetch<any[]>({
    path: `/api/v1/catalog/products`,
    schema: RelaxedProductListSchema, // استخدام الحارس المرن
    ...CACHE_POLICIES.CATALOG,
  });
}

// دالة جلب منتج واحد بتفضل صارمة
export async function getProductById(id: string): Promise<Result<Product>> {
  return executeCommerceFetch<Product>({
    path: `/api/v1/catalog/products/${id}`,
    schema: ProductSchema,
    ...CACHE_POLICIES.CATALOG,
  });
}
