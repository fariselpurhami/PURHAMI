// apps/web/src/components/product/ProductDetailsLive.tsx
import React from 'react';
import { Typography } from '@purhami/design-system';
import { Product } from '@purhami/contracts';

interface ProductDetailsLiveProps {
  product: Product;
}

export function ProductDetailsLive({ product }: ProductDetailsLiveProps) {
  // Derive primary price from the first variant as a structural baseline
  const primaryVariant = product.variants[0];
  const priceDisplay = primaryVariant 
    ? `${primaryVariant.price.amount} ${primaryVariant.price.currencyCode}` 
    : 'Price Unavailable';

  const isPurchasable = product.variants.some(v => v.availableForSale);

  return (
    <section className="w-full lg:w-[40%] flex flex-col gap-8 sticky top-32" aria-label="Product Details">
      <div className="flex flex-col gap-2">
        <Typography variant="caption" className="text-oxblood tracking-widest uppercase">
          {product.vendor}
        </Typography>
        <Typography as="h1" variant="heading-2" className="text-obsidian text-balance">
          {product.title}
        </Typography>
        <Typography variant="body-large" className="text-obsidian mt-2 font-medium">
          {priceDisplay}
        </Typography>
      </div>

      <div className="w-full h-px bg-obsidian/10" />

      {/* Structural Variant Interaction Boundary (Non-interactive in this phase) */}
      <div className="flex flex-col gap-4">
        <Typography variant="caption" className="text-obsidian/60 uppercase">Variants</Typography>
        <div className="flex flex-wrap gap-3">
          {product.variants.map((variant) => (
            <div 
              key={variant.id} 
              className={`px-4 py-2 border ${variant.availableForSale ? 'border-obsidian/20 text-obsidian' : 'border-obsidian/5 text-obsidian/20 line-through'} text-sm font-sans`}
            >
              {variant.title}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div 
          className="text-obsidian-soft font-sans leading-relaxed text-sm [&>p]:mb-4"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      </div>

      <button 
        disabled={!isPurchasable}
        className={`w-full py-4 font-sans tracking-widest uppercase border transition-colors ${
          isPurchasable 
            ? 'bg-obsidian text-porcelain border-obsidian hover:bg-oxblood hover:border-oxblood focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-oxblood' 
            : 'bg-obsidian/5 text-obsidian/30 border-transparent cursor-not-allowed'
        }`}
        aria-disabled={!isPurchasable}
      >
        {isPurchasable ? 'Add to Bag' : 'Out of Stock'}
      </button>
    </section>
  );
}
