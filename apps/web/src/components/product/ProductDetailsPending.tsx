// apps/web/src/components/product/ProductDetailsPending.tsx
import React from 'react';
import { Typography } from '@purhami/design-system';

interface ProductDetailsPendingProps {
  id: string;
}

/**
 * Structural Product Details for pending/empty data contexts.
 * Contains no mock text, only explicit boundary-safe fallbacks.
 */
export function ProductDetailsPending({ id }: ProductDetailsPendingProps) {
  return (
    <section className="w-full lg:w-[40%] flex flex-col gap-8 sticky top-32" aria-label="Product Details">
      <div className="flex flex-col gap-2">
        <Typography variant="caption" className="text-oxblood tracking-widest uppercase">
          Product ID: {id.slice(0, 8)}
        </Typography>
        <Typography as="h1" variant="heading-2" className="text-obsidian/40 italic">
          Title Unavailable
        </Typography>
        <div className="h-6 w-24 bg-porcelain-dimmed mt-2" aria-label="Price placeholder" />
      </div>

      <div className="w-full h-px bg-obsidian/10" />

      <div className="flex flex-col gap-4">
        <Typography variant="body-base" className="text-obsidian-soft">
          Detailed specifications and purchasing options for this item are currently locked pending inventory verification.
        </Typography>
      </div>

      <button 
        disabled 
        className="w-full py-4 bg-obsidian/5 text-obsidian/30 font-sans tracking-widest uppercase cursor-not-allowed border border-transparent transition-colors"
        aria-disabled="true"
      >
        Add to Bag — Unavailable
      </button>
    </section>
  );
}
