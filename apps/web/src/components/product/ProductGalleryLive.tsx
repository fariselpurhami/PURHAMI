// apps/web/src/components/product/ProductGalleryLive.tsx
import React from 'react';
import Image from 'next/image';
import { Typography } from '@purhami/design-system';
import { Product } from '@purhami/contracts';

interface ProductGalleryLiveProps {
  images: Product['images'];
}

export function ProductGalleryLive({ images }: ProductGalleryLiveProps) {
  if (!images || images.length === 0) {
    return (
      <section className="w-full lg:w-[60%] flex flex-col gap-4" aria-label="Product Gallery">
        <div className="aspect-[3/4] w-full bg-porcelain-dimmed flex items-center justify-center">
          <Typography variant="caption" className="text-obsidian/30 uppercase">NO IMAGES</Typography>
        </div>
      </section>
    );
  }

  const [heroImage, ...thumbnails] = images;

  return (
    <section className="w-full lg:w-[60%] flex flex-col gap-4" aria-label="Product Gallery">
      <div className="aspect-[3/4] w-full relative bg-porcelain-dimmed">
        <Image 
          src={heroImage.url} 
          alt={heroImage.altText || 'Product presentation view'}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      </div>
      
      {thumbnails.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {thumbnails.slice(0, 4).map((img, i) => (
            <div key={i} className="aspect-[3/4] w-full relative bg-porcelain-dimmed">
              <Image 
                src={img.url} 
                alt={img.altText || `Product detail view ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 15vw"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
