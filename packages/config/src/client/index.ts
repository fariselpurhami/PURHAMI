// packages/config/src/client/index.ts

import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('https://purhami.com'),
  NEXT_PUBLIC_REDUCED_MOTION_DEFAULT: z.enum(['true', 'false']).default('false'),
});

const processEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_REDUCED_MOTION_DEFAULT: process.env.NEXT_PUBLIC_REDUCED_MOTION_DEFAULT,
};

const parsed = clientEnvSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error('❌ Invalid client environment variables:', parsed.error.format());
  throw new Error('Invalid client environment variables');
}

export const clientConfig = parsed.data;
