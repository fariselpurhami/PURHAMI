import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const MonumentalFooter = () => (
  <footer className="relative w-full py-40 px-6 md:px-24 bg-obsidian border-t border-bloodline/30 z-30">
    <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-end gap-16">
      <h2 className="font-serif text-6xl md:text-9xl text-ivory uppercase tracking-tighter">
        Legacy.
      </h2>
      <div className="flex flex-col gap-6 text-sm tracking-[0.2em] uppercase text-chrome">
        <a href="#" className="hover:text-bloodline flex justify-between border-b border-chrome/20 pb-2 transition-colors">
          La Maison <ArrowUpRight className="w-4 h-4" />
        </a>
        <a href="#" className="hover:text-bloodline flex justify-between border-b border-chrome/20 pb-2 transition-colors">
          Private Appointments <ArrowUpRight className="w-4 h-4" />
        </a>
        <a href="#" className="hover:text-bloodline flex justify-between border-b border-chrome/20 pb-2 transition-colors">
          Legal & Privacy <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
    <div className="max-w-[1800px] mx-auto mt-32 text-[10px] tracking-[0.3em] text-chrome/40 uppercase text-center">
      Engineered by Purhami Intelligence. © {new Date().getFullYear()} All Rights Reserved.
    </div>
  </footer>
);
