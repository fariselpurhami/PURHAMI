// packages/contracts/src/catalog/index.ts

import { z } from 'zod';
import { MoneySchema } from '../shared';

export const ProductVariantSchema = z.object({
  id: z.string().uuid(),
  sku: z.string(),
  title: z.string(),
  price: MoneySchema,
  availableForSale: z.boolean(),
});

export const ProductSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  descriptionHtml: z.string(),
  variants: z.array(ProductVariantSchema),
  images: z.array(z.object({
    url: z.string().url(),
    altText: z.string().optional(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })),
  vendor: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
