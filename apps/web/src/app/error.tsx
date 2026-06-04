// apps/web/src/app/error.tsx
'use client';

import React, { useEffect } from 'react';
import { Typography } from '@purhami/design-system';
import { CenterSafeContainer } from '@purhami/design-system';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an observability service in production
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <CenterSafeContainer className="max-w-xl flex flex-col items-center gap-8">
        <Typography variant="caption" className="text-oxblood tracking-widest">
          SYSTEM EXCEPTION
        </Typography>
        <Typography as="h1" variant="heading-1">
          The experience was interrupted.
        </Typography>
        <Typography variant="body-base" className="text-obsidian-soft">
          We encountered an unexpected condition while preparing this view. Our engineering team has been notified.
        </Typography>
        <button
          onClick={() => reset()}
          className="mt-4 px-8 py-3 bg-obsidian text-porcelain font-sans text-sm tracking-wider uppercase transition-colors hover:bg-oxblood focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-oxblood"
        >
          Attempt Recovery
        </button>
      </CenterSafeContainer>
    </div>
  );
}
