// apps/web/src/app/not-found.tsx
import React from 'react';
import Link from 'next/link';
import { Typography } from '@purhami/design-system';
import { CenterSafeContainer } from '@purhami/design-system';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <CenterSafeContainer className="max-w-xl flex flex-col items-center gap-8">
        <Typography variant="caption" className="text-oxblood tracking-widest">
          HTTP 404
        </Typography>
        <Typography as="h1" variant="heading-1">
          This destination is unmapped.
        </Typography>
        <Typography variant="body-base" className="text-obsidian-soft">
          The specific collection, product, or editorial piece you are looking for does not exist within the current architecture.
        </Typography>
        <Link 
          href="/"
          className="mt-4 px-8 py-3 bg-transparent border border-obsidian text-obsidian font-sans text-sm tracking-wider uppercase transition-colors hover:bg-obsidian hover:text-porcelain focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-oxblood"
        >
          Return to Flagship
        </Link>
      </CenterSafeContainer>
    </div>
  );
}
