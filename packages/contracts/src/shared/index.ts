// packages/contracts/src/shared/index.ts

import { z } from 'zod';

export const MoneySchema = z.object({
  amount: z.string(),
  currencyCode: z.string().length(3),
});

export const PaginationSchema = z.object({
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  startCursor: z.string().nullable(),
  endCursor: z.string().nullable(),
});

export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export type Money = z.infer<typeof MoneySchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
