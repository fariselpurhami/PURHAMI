// apps/api/src/config/env.ts
import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DOWNSTREAM_COMMERCE_URL: z.string().url().default('http://localhost:4001'),
  DOWNSTREAM_CMS_URL: z.string().url().default('http://localhost:4002'),
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid API environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
