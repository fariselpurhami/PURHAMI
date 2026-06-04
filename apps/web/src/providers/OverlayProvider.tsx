// apps/web/src/providers/OverlayProvider.tsx
'use client';

import React, { createContext, useState, useCallback, useMemo } from 'react';

type OverlayType = 'navigation' | 'search' | 'cart' | 'none';

interface OverlayContextValue {
  activeOverlay: OverlayType;
  openOverlay: (overlay: Exclude<OverlayType, 'none'>) => void;
  closeAll: () => void;
}

export const OverlayContext = createContext<OverlayContextValue | undefined>(undefined);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>('none');

  const openOverlay = useCallback((overlay: Exclude<OverlayType, 'none'>) => {
    setActiveOverlay(overlay);
  }, []);

  const closeAll = useCallback(() => {
    setActiveOverlay('none');
  }, []);

  const value = useMemo(() => ({
    activeOverlay,
    openOverlay,
    closeAll
  }), [activeOverlay, openOverlay, closeAll]);

  return (
    <OverlayContext.Provider value={value}>
      {children}
    </OverlayContext.Provider>
  );
}
