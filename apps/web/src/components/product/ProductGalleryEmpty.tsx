// apps/web/src/components/product/ProductGalleryEmpty.tsx
import React from 'react';
import { Typography } from '@purhami/design-system';

/**
 * Structural Product Gallery for pending/empty data contexts.
 * Pre-reserves layout footprint to prevent CLS.
 */
export function ProductGalleryEmpty() {
  return (
    <section className="w-full lg:w-[60%] flex flex-col gap-4" aria-label="Product Gallery">
      <div className="aspect-[3/4] w-full bg-porcelain-dimmed relative flex items-center justify-center border border-obsidian/5">
        <Typography variant="caption" className="text-obsidian/30 tracking-widest uppercase">
          ASSET PENDING
        </Typography>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i} 
            className="aspect-[3/4] bg-porcelain-dimmed w-full border border-obsidian/5" 
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}
