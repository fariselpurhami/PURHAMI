// apps/web/src/components/navigation/NavigationDrawer.tsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useOverlay } from '~/hooks/use-overlay';
import { useScrollLock } from '~/hooks/use-scroll-lock';
import { Typography } from '@purhami/design-system';
import { cn } from '~/lib/utils';
import { MegaMenu } from '@purhami/contracts';

interface NavigationDrawerProps {
  menu: MegaMenu;
}

export function NavigationDrawer({ menu }: NavigationDrawerProps) {
  const { activeOverlay, closeAll } = useOverlay();
  const isOpen = activeOverlay === 'navigation';
  
  useScrollLock(isOpen);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAll(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeAll]);

  const hasMenuData = menu.length > 0;

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-obsidian/40 backdrop-blur-sm transition-opacity duration-cinematic ease-couture",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeAll}
        aria-hidden="true"
      />

      <nav 
        role="dialog"
        aria-modal="true"
        aria-label="Main Navigation"
        className={cn(
          "fixed top-0 left-0 bottom-0 w-full max-w-md bg-porcelain z-50 flex flex-col transition-transform duration-cinematic ease-tension",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-obsidian/10">
          <Typography variant="caption" className="tracking-widest">MENU</Typography>
          <button 
            onClick={closeAll}
            className="text-sm font-sans uppercase tracking-widest p-2 hover:text-oxblood focus-visible:ring-2 focus-visible:ring-oxblood"
            aria-label="Close Menu"
          >
            Close
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-12 py-16 flex flex-col gap-8">
           {hasMenuData ? (
             menu.map((group, idx) => (
               <div key={idx} className="flex flex-col gap-4">
                 <Typography variant="caption" className="text-obsidian/40 uppercase">{group.title}</Typography>
                 {group.links.map((link) => (
                   <Link key={link.href} href={link.href} onClick={closeAll} className="group flex items-center">
                     <Typography variant="heading-2" className="text-obsidian group-hover:text-oxblood transition-colors">{link.label}</Typography>
                   </Link>
                 ))}
               </div>
             ))
           ) : (
             <div className="flex items-center h-full">
               <Typography variant="body-base" className="text-obsidian/40 italic">
                 Navigation structure is currently offline.
               </Typography>
             </div>
           )}
        </div>
      </nav>
    </>
  );
}
