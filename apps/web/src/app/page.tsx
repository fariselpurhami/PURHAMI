'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WebGLBloodline } from '../components/brand-ornament/WebGLBloodline';
import { MagneticCursor } from '../components/kinematics/MagneticCursor';
import { CinematicCard } from '../components/commerce/CinematicCard';
import { HUD } from '../components/layout/HUD';
import { MonumentalFooter } from '../components/layout/MonumentalFooter';
import { useKinematicScroll } from '../hooks/use-kinematic-scroll';
import { CatalogSeed } from '../lib/seed-data';

export default function FlagshipStorefront() {
  const { containerRef, velocity } = useKinematicScroll();

  return (
    <div className="relative min-h-screen bg-obsidian text-ivory font-sans selection:bg-bloodline selection:text-ivory overflow-hidden">
      
      <MagneticCursor />
      <WebGLBloodline />
      <HUD />

      {/* الـ Container المتحرك ديناميكياً باستخدام Kinematics */}
      <div 
        ref={containerRef} 
        className="fixed top-0 left-0 w-full will-change-transform z-10"
      >
        <section className="relative w-full h-screen flex flex-col items-center justify-center pt-20">
          <h1 className="font-serif text-[18vw] leading-[0.8] tracking-tighter text-ivory mix-blend-overlay opacity-90 text-center uppercase pointer-events-none">
            Purhami
          </h1>
          <p className="font-sans text-xs md:text-sm tracking-[0.5em] uppercase text-chrome mt-12 mb-8">
            The Architecture of Power
          </p>
          <button className="group flex items-center gap-4 text-xs tracking-[0.3em] uppercase font-bold text-ivory hover:text-bloodline transition-colors duration-500">
            Enter The Bloodline 
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
          </button>
        </section>

        <section className="relative w-full mt-32 md:mt-64 z-20">
          <div className="max-w-[1800px] mx-auto">
            {CatalogSeed.map((product, idx) => (
              <CinematicCard 
                key={product.sku} 
                product={product} 
                index={idx} 
                velocity={velocity} 
              />
            ))}
          </div>
        </section>

        <MonumentalFooter />
      </div>
    </div>
  );
}
