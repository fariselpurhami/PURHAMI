// apps/web/src/app/(store)/product/[id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductById } from '@purhami/api-client';
import { CenterSafeContainer } from '@purhami/design-system';
import { ProductGalleryLive } from '~/components/product/ProductGalleryLive';
import { ProductDetailsLive } from '~/components/product/ProductDetailsLive';
import { ProductDetailsPending } from '~/components/product/ProductDetailsPending';
import { ProductGalleryEmpty } from '~/components/product/ProductGalleryEmpty';

interface ProductPageProps {
  params: { id: string };
}

// Explicit Metadata Boundary utilizing pure validated contracts
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const result = await getProductById(params.id);
  if (!result.success) {
    return { title: 'Not Found | PURHAMI' };
  }
  return {
    title: `${result.data.title} | PURHAMI`,
    description: `Shop the ${result.data.title} by ${result.data.vendor}.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const result = await getProductById(id);

  if (!result.success) {
    if (result.error.code === 'NOT_FOUND') {
      notFound();
    }
    // CONTRACT_MISMATCH or UNAVAILABLE defaults to pending layout safely
    console.error(`[PDP] Hydration Failed: ${result.error.code}`, result.error.correlationId);
    return (
      <div className="w-full pb-24 pt-8 md:pt-16">
        <CenterSafeContainer>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            <ProductGalleryEmpty />
            <ProductDetailsPending id={id} />
          </div>
        </CenterSafeContainer>
      </div>
    );
  }

  const product = result.data;

  return (
    <div className="w-full pb-24 pt-8 md:pt-16">
      <CenterSafeContainer>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          <ProductGalleryLive images={product.images} />
          <ProductDetailsLive product={product} />
        </div>
      </CenterSafeContainer>
    </div>
  );
}
