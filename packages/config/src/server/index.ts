// packages/config/src/server/index.ts

import { z } from 'zod';

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  COMMERCE_API_URL: z.string().url().optional(),
  COMMERCE_API_SECRET: z.string().min(1).optional(),
});

const parsed = serverEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid server environment variables:', parsed.error.format());
  throw new Error('Invalid server environment variables');
}

export const serverConfig = parsed.data;
