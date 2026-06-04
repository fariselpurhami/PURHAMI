// apps/web/src/lib/constants.ts
/**
 * Web-local constants governing global application thresholds.
 * Values shared across boundaries should reside in @purhami/config instead.
 */
export const WEB_CONSTANTS = {
  HEADER_HEIGHT_PX: 80,
  MOBILE_BREAKPOINT_PX: 768,
  ANIMATION_GRACE_PERIOD_MS: 50,
} as const;
