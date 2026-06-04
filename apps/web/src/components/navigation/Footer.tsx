// apps/web/src/components/navigation/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { Typography, CenterSafeContainer } from '@purhami/design-system';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-obsidian text-porcelain py-16 md:py-24 mt-auto">
      <CenterSafeContainer>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-porcelain/20 pb-16">
          <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
            <Typography variant="heading-2" color="porcelain" className="tracking-widest uppercase">
              PURHAMI
            </Typography>
            <Typography variant="body-base" className="text-porcelain/60 max-w-sm">
              An architectural approach to luxury. Engineering the future of global fashion experiences.
            </Typography>
          </div>
          
          <div className="flex flex-col gap-4">
            <Typography variant="caption" className="text-porcelain/40 uppercase">Collections</Typography>
            <div className="flex flex-col gap-2">
               {/* Structural Links - Safe placeholders without mock data */}
               <Link href="/collection/essentials" className="text-porcelain/80 hover:text-porcelain transition-colors">Essentials</Link>
               <Link href="/collection/accessories" className="text-porcelain/80 hover:text-porcelain transition-colors">Accessories</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Typography variant="caption" className="text-porcelain/40 uppercase">Legal</Typography>
            <div className="flex flex-col gap-2">
               <span className="text-porcelain/40 cursor-not-allowed">Privacy Policy</span>
               <span className="text-porcelain/40 cursor-not-allowed">Terms of Service</span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center text-porcelain/40 text-sm">
          <p>&copy; {currentYear} PURHAMI. All rights reserved.</p>
          <p className="mt-2 md:mt-0 uppercase tracking-widest text-xs">V1.0 - Digital Flagship</p>
        </div>
      </CenterSafeContainer>
    </footer>
  );
}
