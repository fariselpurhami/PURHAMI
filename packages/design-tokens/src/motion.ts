// packages/design-tokens/src/motion.ts
export const motion = {
  durations: {
    fast: '200ms',
    base: '300ms',
    slow: '500ms',
    cinematic: '800ms',
    epic: '1200ms',
  },
  easings: {
    couture: [0.4, 0, 0.2, 1],
    tension: [0.34, 1.56, 0.64, 1],
    silk: [0.25, 0.1, 0.25, 1],
    editorial: [0.16, 1, 0.3, 1],
  },
} as const;
