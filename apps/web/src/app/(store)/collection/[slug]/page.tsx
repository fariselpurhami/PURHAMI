// apps/web/src/app/(store)/collection/[slug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { Typography, CenterSafeContainer, ProductCardEmpty } from '@purhami/design-system';

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

// Ensure dynamic rendering safely if slug format is unpredictable
export const dynamic = 'force-dynamic';

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = params;

  // Structural sanity check: Reject malformed slugs immediately
  if (!slug || typeof slug !== 'string' || slug.length < 2) {
    notFound();
  }

  // Format slug for display purposes since we lack real category data
  const displayTitle = slug.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="w-full pb-24 pt-12 md:pt-20">
      <CenterSafeContainer className="flex flex-col gap-12 md:gap-20">
        {/* Collection Hero Header */}
        <header className="flex flex-col items-center text-center gap-4 border-b border-obsidian/10 pb-12">
          <Typography as="h1" variant="heading-1" className="break-words max-w-full">
            {displayTitle}
          </Typography>
          <Typography variant="body-base" className="text-obsidian-soft max-w-2xl">
            The curated selection for {displayTitle.toLowerCase()} is currently being synchronized with our global inventory systems.
          </Typography>
        </header>

        {/* Structural Grid Area - Populated with empty states per mandate */}
        <section aria-label="Collection Products">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardEmpty key={i} />
            ))}
          </div>
        </section>
      </CenterSafeContainer>
    </div>
  );
}
