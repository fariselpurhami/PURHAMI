// packages/design-system/src/composites/ProductCardEmpty.tsx

import * as React from 'react';
import { Typography } from '../primitives/Typography';

/**
 * Architectural Empty State: No mocked data.
 * This component preserves the compositional footprint of a product card
 * while waiting for real commerce data to be wired.
 */
export function ProductCardEmpty() {
  return (
    <div className="group relative flex flex-col gap-xs" aria-hidden="true">
      <div className="aspect-[3/4] w-full overflow-hidden bg-porcelain-dimmed relative">
        {/* Vein engine or loader can be portal-ed here in the future */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-soft/5 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
      </div>
      <div className="flex flex-col gap-2xs pt-xs">
        <div className="h-4 w-2/3 bg-porcelain-dimmed animate-pulse" />
        <div className="h-4 w-1/4 bg-porcelain-dimmed animate-pulse" />
      </div>
      <span className="sr-only">Product loading...</span>
    </div>
  );
}
