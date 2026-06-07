// apps/identity/src/config/env.ts
import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.string().default('4002'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long for HS256"),
  DATABASE_URL: z.string().url("Must be a valid Postgres connection string").optional(),
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid Identity environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
