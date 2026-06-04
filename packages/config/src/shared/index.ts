// packages/config/src/shared/index.ts

export const sharedConfig = {
  features: {
    enableVeinEngine: true,
    enableCommerceCheckout: false, // Phase 1 is purely catalog/brand shell
  },
  pagination: {
    defaultLimit: 24,
  },
} as const;
