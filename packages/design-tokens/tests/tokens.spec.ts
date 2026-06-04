// packages/design-tokens/tests/tokens.spec.ts
import { describe, it, expect } from 'vitest';
import { colors, typography } from '../src';

describe('Design Tokens Boundary', () => {
  it('exposes exact brand oxblood definitions', () => {
    expect(colors.oxblood.DEFAULT).toBe('#4A0E17');
    expect(colors.oxblood.deep).toBe('#2D080E');
    expect(colors.oxblood.luminous).toBe('#731724');
  });

  it('preserves mathematical typography scales', () => {
    expect(typography.sizes['display-1'][0]).toBe('4.5rem');
    expect(typography.sizes['body-base'][0]).toBe('1rem');
  });
});
