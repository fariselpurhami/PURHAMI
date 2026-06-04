// packages/brand-ornament-engine/src/core/rendering/svgRenderer.ts
import type { PathData } from '../types';

export function createPathAttributes(
  path: PathData,
  isVisible: boolean,
  prefersReducedMotion: boolean
) {
  return {
    d: path.d,
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeDasharray: path.length,
    strokeDashoffset: isVisible ? 0 : path.length,
    style: {
      transition: prefersReducedMotion 
        ? 'opacity 400ms ease-in-out' 
        : 'stroke-dashoffset 2400ms cubic-bezier(0.6, 0.05, 0.01, 0.99), opacity 800ms ease-out',
      opacity: isVisible ? 1 : 0,
    }
  };
}
