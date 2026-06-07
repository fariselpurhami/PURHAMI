// apps/commerce/src/config/env.ts
import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.string().default('4001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Controls if we allow fixture data to boot for local dev. Strictly disabled in prod.
  ALLOW_LOCAL_FIXTURES: z.string().transform((v) => v === 'true').default('false'), 
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid Commerce environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
