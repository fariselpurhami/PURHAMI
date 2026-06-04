// apps/web/src/app/loading.tsx
import React from 'react';

/**
 * Architectural Loading Mask.
 * Uses the brand's porcelain and oxblood tones rather than a generic spinner.
 * Operates purely on CSS animation to keep the main thread unblocked.
 */
export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-porcelain pointer-events-none" aria-busy="true" aria-label="Loading content">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Core pulse */}
        <div className="absolute inset-0 border-[1px] border-oxblood/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
        {/* Inner solid */}
        <div className="w-2 h-2 bg-oxblood rounded-full animate-pulse" />
      </div>
    </div>
  );
}
