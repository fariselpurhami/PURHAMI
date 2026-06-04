// packages/brand-ornament-engine/tests/engine.spec.ts
import { generateVeinPaths } from '../src/core/math/branchGenerator';

describe('Brand Ornament Engine Math', () => {
  it('generates deterministic center-safe paths for left anchor', () => {
    const paths = generateVeinPaths(1000, 1000, 'left', 'sparse');
    expect(paths.length).toBe(3);
    // Center-safe verification: Max X should not exceed 25% of width (250)
    paths.forEach(p => {
      const match = p.d.match(/M 0 \d+ C \d+ \d+, \d+ \d+, (\d+) \d+/);
      expect(match).not.toBeNull();
      const endX = parseInt(match![1], 10);
      expect(endX).toBeLessThanOrEqual(250);
    });
  });
});
