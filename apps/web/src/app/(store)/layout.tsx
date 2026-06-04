// apps/web/src/app/(store)/layout.tsx
import React from 'react';
import { getMegaMenu } from '@purhami/api-client';
import { Header } from '~/components/navigation/Header';
import { Footer } from '~/components/navigation/Footer';
import { SearchOverlay } from '~/components/search/SearchOverlay';
import { NavigationDrawer } from '~/components/navigation/NavigationDrawer';
import { MegaMenu } from '@purhami/contracts';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Navigation Fetch: Do not trigger notFound() on failure. Provide degraded state.
  const menuResult = await getMegaMenu();
  const navigationData: MegaMenu = menuResult.success ? menuResult.data : [];

  if (!menuResult.success) {
    console.error(`[Layout] Navigation Hydration Degraded: ${menuResult.error.code}`, menuResult.error.correlationId);
  }

  return (
    <div className="flex flex-col min-h-screen w-full relative">
      <Header />
      <main className="flex-grow w-full mt-[var(--header-height,80px)]">
        {children}
      </main>
      <Footer />
      
      {/* Overlays accepting live or degraded contract data */}
      <SearchOverlay />
      <NavigationDrawer menu={navigationData} />
    </div>
  );
}
