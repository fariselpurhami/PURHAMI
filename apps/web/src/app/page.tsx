// apps/web/src/app/page.tsx
import React from 'react';
import { OrnamentLayer } from '@purhami/brand-ornament-engine';
import { CinematicReveal } from '~/components/layout/CinematicReveal';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-porcelain flex flex-col items-center overflow-x-hidden">
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
         <OrnamentLayer seed={101} color="var(--oxblood, #4A0E17)" />
      </div>

      <section className="relative z-10 w-full min-h-[90vh] flex flex-col items-center justify-center px-6 text-center">
        
        <CinematicReveal delay={100}>
          <span className="text-oxblood uppercase tracking-[0.2em] text-xs font-semibold mb-8 block">
            The Digital Flagship
          </span>
        </CinematicReveal>

        <CinematicReveal delay={300}>
          <h1 className="font-heading text-[clamp(3rem,10vw,8rem)] leading-[0.95] tracking-tight text-obsidian text-balance max-w-6xl mx-auto">
            Power. Vision.<br />Precision.
          </h1>
        </CinematicReveal>

        <CinematicReveal delay={600}>
           <div className="mt-12 flex flex-col md:flex-row gap-6 items-center">
             <button className="px-8 py-4 bg-obsidian text-porcelain font-sans uppercase tracking-widest text-sm hover:bg-oxblood transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-oxblood">
               Explore Collections
             </button>
           </div>
        </CinematicReveal>

      </section>

      <section className="relative z-10 w-full min-h-[50vh] flex flex-col items-center justify-center px-6 py-24 bg-porcelain/50 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto text-center">
          <CinematicReveal direction="up">
            <p className="font-sans text-lg md:text-xl leading-relaxed text-obsidian/80 text-balance">
              A world-class fashion house spanning accessories to essentials. 
              The infrastructure is currently being aligned for the global debut.
            </p>
          </CinematicReveal>
          
          <CinematicReveal delay={200}>
             <div className="w-px h-16 bg-oxblood/30 mx-auto mt-12" aria-hidden="true" />
          </CinematicReveal>
        </div>
      </section>

    </div>
  );
}
