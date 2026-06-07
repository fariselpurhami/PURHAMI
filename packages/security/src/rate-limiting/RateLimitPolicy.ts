// packages/security/src/rate-limiting/RateLimitPolicy.ts
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const RATE_LIMIT_POLICIES = {
  PUBLIC_API: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  SENSITIVE_API: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
  }
} as const;
