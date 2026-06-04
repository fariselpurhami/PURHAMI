// apps/web/src/components/search/SearchOverlay.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { useOverlay } from '~/hooks/use-overlay';
import { useScrollLock } from '~/hooks/use-scroll-lock';
import { Typography, CenterSafeContainer } from '@purhami/design-system';
import { cn } from '~/lib/utils';

export function SearchOverlay() {
  const { activeOverlay, closeAll } = useOverlay();
  const isOpen = activeOverlay === 'search';
  const inputRef = useRef<HTMLInputElement>(null);
  
  useScrollLock(isOpen);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to allow CSS transition to begin before forcing focus
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAll(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeAll]);

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Search Catalog"
      className={cn(
        "fixed inset-0 z-50 bg-porcelain flex flex-col transition-all duration-cinematic ease-couture transform origin-top",
        isOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-0 pointer-events-none"
      )}
    >
      <div className="w-full h-24 flex items-center border-b border-obsidian/10">
        <CenterSafeContainer className="flex items-center justify-between">
          <Typography variant="caption" className="tracking-widest opacity-0">SPACER</Typography>
          <button 
            onClick={closeAll}
            className="text-sm font-sans uppercase tracking-widest p-2 hover:text-oxblood focus-visible:ring-2 focus-visible:ring-oxblood"
            aria-label="Close Search"
          >
            Close
          </button>
        </CenterSafeContainer>
      </div>

      <div className="flex-grow flex flex-col items-center pt-24 px-6">
        <form className="w-full max-w-4xl relative" onSubmit={(e) => e.preventDefault()}>
          <input 
            ref={inputRef}
            type="search"
            placeholder="SEARCH CATALOG"
            className="w-full bg-transparent border-none text-4xl md:text-6xl font-serif text-obsidian text-center focus:outline-none placeholder:text-obsidian/20 tracking-wide"
            aria-label="Search input"
          />
          <div className="absolute -bottom-4 left-0 right-0 h-px bg-obsidian/20" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-oxblood transition-all duration-700 ease-couture focus-within:w-full" />
        </form>

        <div className="mt-16 text-center">
           <Typography variant="body-base" className="text-obsidian-soft italic">
             Search functionality is awaiting index completion.
           </Typography>
        </div>
      </div>
    </div>
  );
}
