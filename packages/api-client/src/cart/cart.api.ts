import { z } from 'zod';
import { executeCommerceFetch } from '../core/fetcher';
import { Result } from '../core/error';

const cartMoneySchema = z.object({
  amount: z.number().finite(),
  currency: z.string().min(3).max(3),
});

const cartImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().trim().min(1).max(500).nullable().optional(),
});

const cartProductSchema = z.object({
  id: z.string().trim().min(1).max(128),
  title: z.string().trim().min(1).max(500),
  handle: z.string().trim().min(1).max(500).optional(),
  image: cartImageSchema.nullable().optional(),
});

const cartVariantSchema = z.object({
  id: z.string().trim().min(1).max(128),
  title: z.string().trim().min(1).max(500),
  sku: z.string().trim().min(1).max(128).nullable().optional(),
  product: cartProductSchema.optional(),
  unitPrice: cartMoneySchema.optional(),
});

const cartItemSchema = z.object({
  id: z.string().trim().min(1).max(128),
  variantId: z.string().trim().min(1).max(128),
  productId: z.string().trim().min(1).max(128).nullable().optional(),
  title: z.string().trim().min(1).max(500),
  quantity: z.number().int().min(1).max(999),
  unitPrice: cartMoneySchema.optional(),
  subtotal: cartMoneySchema.optional(),
  total: cartMoneySchema.optional(),
  image: cartImageSchema.nullable().optional(),
  variant: cartVariantSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const cartSummarySchema = z.object({
  itemCount: z.number().int().min(0).max(100000).optional(),
  subtotal: cartMoneySchema.optional(),
  tax: cartMoneySchema.optional(),
  shipping: cartMoneySchema.optional(),
  discount: cartMoneySchema.optional(),
  total: cartMoneySchema.optional(),
});

const cartSchema = z.object({
  id: z.string().trim().min(1).max(128),
  customerId: z.string().trim().min(1).max(128).nullable().optional(),
  status: z.string().trim().min(1).max(64).optional(),
  items: z.array(cartItemSchema),
  summary: cartSummarySchema.optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// 🌟 التعديل الأول: غيرنا variantId لـ productId في الـ Request Schema
const addItemRequestSchema = z.object({
  productId: z.string().trim().min(1).max(128),
  quantity: z.number().int().min(1).max(999),
});

const removeItemResultSchema = z.union([
  cartSchema,
  z.object({
    success: z.literal(true),
  }),
  z.object({}).passthrough(),
]);

export type Cart = z.infer<typeof cartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type AddItemRequest = z.infer<typeof addItemRequestSchema>;

function normalizeIdentifier(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new TypeError(`${fieldName} is required`);
  }
  if (normalized.length > 128) {
    throw new TypeError(`${fieldName} exceeds maximum length`);
  }
  return encodeURIComponent(normalized);
}

function normalizeQuantity(quantity: number): number {
  if (!Number.isInteger(quantity)) {
    throw new TypeError('quantity must be an integer');
  }
  if (quantity < 1 || quantity > 999) {
    throw new RangeError('quantity must be between 1 and 999');
  }
  return quantity;
}

export const CartAPI = {
  async getCart(cartId: string): Promise<Result<Cart>> {
    const normalizedCartId = normalizeIdentifier(cartId, 'cartId');

    return executeCommerceFetch<Cart>({
      path: `/api/v1/carts/${normalizedCartId}`,
      schema: cartSchema,
      method: 'GET',
    });
  },

  // 🌟 التعديل الثاني: الدالة بقت تستقبل productId وبتبعته في الـ Payload
  async addItem(cartId: string, productId: string, quantity: number): Promise<Result<any>> {
    const normalizedCartId = normalizeIdentifier(cartId, 'cartId');
    const payload = addItemRequestSchema.parse({
      productId: normalizeIdentifier(productId, 'productId'),
      quantity: normalizeQuantity(quantity),
    });

    return executeCommerceFetch<any>({
      path: `/api/v1/carts/${normalizedCartId}/items`,
      schema: removeItemResultSchema,
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async removeItem(cartId: string, itemId: string): Promise<Result<Cart | { success: true } | Record<string, never>>> {
    const normalizedCartId = normalizeIdentifier(cartId, 'cartId');
    const normalizedItemId = normalizeIdentifier(itemId, 'itemId');

    return executeCommerceFetch<Cart | { success: true } | Record<string, never>>({
      path: `/api/v1/carts/${normalizedCartId}/items/${normalizedItemId}`,
      schema: removeItemResultSchema,
      method: 'DELETE',
    });
  },
};
