import React from 'react';
import { Menu } from 'lucide-react';

export const HUD = () => (
  <header className="fixed top-0 left-0 w-full z-40 p-8 flex justify-between items-start mix-blend-difference text-white pointer-events-none">
    <div className="flex flex-col gap-2 pointer-events-auto">
      <button className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-bold hover:text-bloodline transition-colors focus:outline-none">
        <Menu className="w-5 h-5 stroke-[1.5]" /> Menu
      </button>
      <div className="text-[10px] tracking-widest uppercase mt-4 text-white/50">
        FW / 2026<br/>
        Paris . Milan
      </div>
    </div>

    <div className="pointer-events-auto">
      <button className="text-xs tracking-[0.2em] uppercase font-bold hover:text-bloodline transition-colors">
        Cart [0]
      </button>
    </div>
  </header>
);
