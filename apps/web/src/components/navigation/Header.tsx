// apps/web/src/components/navigation/Header.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useOverlay } from '~/hooks/use-overlay';
import { Typography } from '@purhami/design-system';
import { cn } from '~/lib/utils';
import { WEB_CONSTANTS } from '~/lib/constants';

export function Header() {
  const { openOverlay } = useOverlay();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ease-couture',
        scrolled ? 'bg-porcelain/90 backdrop-blur-md border-b border-obsidian/5' : 'bg-transparent'
      )}
      style={{ height: WEB_CONSTANTS.HEADER_HEIGHT_PX }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-sm md:px-lg lg:px-2xl h-full flex items-center justify-between">
        
        <button 
          onClick={() => openOverlay('navigation')}
          className="group flex flex-col gap-[5px] p-2 -ml-2 focus-visible:ring-2 focus-visible:ring-oxblood"
          aria-label="Open Navigation Menu"
        >
          <div className="w-6 h-px bg-obsidian transition-transform duration-300 group-hover:translate-x-1" />
          <div className="w-4 h-px bg-obsidian transition-transform duration-300 group-hover:translate-x-2" />
        </button>

        <Link 
          href="/" 
          className="absolute left-1/2 -translate-x-1/2 focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-4"
          aria-label="PURHAMI Home"
        >
          <Typography variant="heading-2" className="tracking-widest uppercase">
            PURHAMI
          </Typography>
        </Link>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => openOverlay('search')}
            className="text-sm font-sans tracking-widest uppercase transition-colors hover:text-oxblood focus-visible:ring-2 focus-visible:ring-oxblood p-1"
          >
            Search
          </button>
          <button 
            className="text-sm font-sans tracking-widest uppercase text-obsidian/40 cursor-not-allowed p-1 hidden md:block"
            aria-disabled="true"
          >
            Cart (0)
          </button>
        </div>

      </div>
    </header>
  );
}
