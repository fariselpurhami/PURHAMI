// apps/web/src/app/layout.tsx
import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { OrnamentLayer } from '@purhami/brand-ornament-engine';
import { colors } from '@purhami/design-tokens';
import { AppProviders } from '~/providers';
import '~/styles/globals.css';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | PURHAMI',
    default: 'PURHAMI | Official Digital Flagship',
  },
  description: 'World-class fashion house spanning accessories to essentials. Power, vision, charisma, and precision.',
  metadataBase: new URL('https://purhami.com'),
};

export const viewport: Viewport = {
  themeColor: colors.porcelain.DEFAULT,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="bg-porcelain text-obsidian min-h-screen selection:bg-oxblood selection:text-porcelain overflow-x-hidden relative flex flex-col">
        <AppProviders>
          {/* Base Architectural Porcelain/Vein Layer */}
          <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
            <OrnamentLayer 
              density="dense" 
              color={colors.oxblood.DEFAULT} 
              opacity={0.08} 
              edgeAnchor="both" 
            />
          </div>
          
          {/* Stacking Context for Content */}
          <main className="relative z-10 flex flex-col flex-grow w-full">
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
