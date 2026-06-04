// apps/web/src/hooks/use-overlay.ts
'use client';

import { useContext } from 'react';
import { OverlayContext } from '~/providers/OverlayProvider';

/**
 * Access overlay orchestration state safely.
 * Throws if utilized outside the OverlayProvider boundary.
 */
export function useOverlay() {
  const context = useContext(OverlayContext);
  if (context === undefined) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
}
