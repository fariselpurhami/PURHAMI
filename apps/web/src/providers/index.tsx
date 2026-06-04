// apps/web/src/providers/index.tsx
'use client';

import React from 'react';
import { OverlayProvider } from './OverlayProvider';

/**
 * Centralized provider orchestration.
 * Strict adherence to separating server rendering bounds and client context domains.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <OverlayProvider>
      {children}
    </OverlayProvider>
  );
}
