// packages/api-client/src/cart/cart.api.ts
import { z } from 'zod';
import { executeCommerceFetch } from '../core/fetcher';
import { Result } from '../core/error';

const RelaxedCartSchema = z.any(); 

export const CartAPI = {
  async getCart(cartId: string): Promise<Result<any>> {
    return executeCommerceFetch<any>({
      path: `/api/v1/carts/${cartId}`,
      schema: RelaxedCartSchema,
      method: 'GET',
    });
  },

  async addItem(cartId: string, variantId: string, quantity: number): Promise<Result<any>> {
    return executeCommerceFetch<any>({
      path: `/api/v1/carts/${cartId}/items`,
      schema: RelaxedCartSchema,
      method: 'POST',
      body: JSON.stringify({ variantId, quantity }),
    });
  },

  // 🗑️ التحديث الجديد: دالة إزالة المنتج من السلة
  async removeItem(cartId: string, itemId: string): Promise<Result<any>> {
    return executeCommerceFetch<any>({
      path: `/api/v1/carts/${cartId}/items/${itemId}`,
      schema: RelaxedCartSchema,
      method: 'DELETE',
    });
  }
};
