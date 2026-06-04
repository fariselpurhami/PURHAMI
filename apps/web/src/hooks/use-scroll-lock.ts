// apps/web/src/hooks/use-scroll-lock.ts
'use client';

import { useEffect } from 'react';
import { DOMOrchestrator } from '~/client/orchestrator';

/**
 * Synchronizes DOM body scroll lock with React component lifecycle.
 * Mitigates layout shift by accounting for scrollbar width.
 */
export function useScrollLock(lock: boolean) {
  useEffect(() => {
    if (lock) {
      DOMOrchestrator.lockScroll();
    } else {
      DOMOrchestrator.unlockScroll();
    }

    return () => {
      DOMOrchestrator.unlockScroll();
    };
  }, [lock]);
}
