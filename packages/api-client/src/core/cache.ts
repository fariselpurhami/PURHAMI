// packages/api-client/src/core/cache.ts
export const CACHE_POLICIES = {
  NAVIGATION: { next: { revalidate: 3600 } }, // 1 Hour
  CATALOG: { next: { revalidate: 900 } },     // 15 Minutes
} as const;
