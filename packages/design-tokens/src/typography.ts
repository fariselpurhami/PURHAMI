// packages/design-tokens/src/typography.ts
export const typography = {
  fonts: {
    heading: 'var(--font-heading, "Playfair Display", serif)',
    body: 'var(--font-sans, "Inter", sans-serif)',
  },
  sizes: {
    'display-1': ['clamp(3rem, 10vw, 8rem)', { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '400' }],
    'display-2': ['clamp(2.5rem, 8vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.01em', fontWeight: '400' }],
    'heading-1': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '0em', fontWeight: '400' }],
    'heading-2': ['1.5rem', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '500' }],
    'body-large': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0em', fontWeight: '400' }],
    'body-base': ['1rem', { lineHeight: '1.6', letterSpacing: '0em', fontWeight: '400' }],
    'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em', fontWeight: '500' }],
  },
} as const;
