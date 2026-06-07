'use client';

import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { usePresence } from '../../hooks/use-presence';
import { BrandOrnamentController } from '../brand-ornament/BrandOrnamentController';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationDrawer = ({ isOpen, onClose }: NavigationDrawerProps) => {
  const { render, show } = usePresence(isOpen, 600);

  if (!render) return null;

  const links = ['Collection', 'House', 'Artifacts', 'Client Services'];

  return (
    <div className="fixed inset-0 z-50 flex" aria-modal="true" role="dialog">
      <div 
        className={`absolute inset-0 bg-[#121212]/40 backdrop-blur-sm transition-opacity duration-500 ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      <nav 
        className={`relative w-full max-w-md bg-[#F9F8F6] h-full shadow-2xl flex flex-col transition-transform duration-[600ms] ease-tension ${
          show ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <BrandOrnamentController isVisible={show} variant="nav" />
        
        <div className="flex justify-between items-center p-8 border-b border-[#3B0918]/10 relative z-10">
          <span className="font-serif text-xl tracking-widest text-[#3B0918] uppercase">Purhami</span>
          <button 
            onClick={onClose}
            className="p-2 text-[#3B0918] hover:rotate-90 transition-transform duration-500 focus:outline-none focus:ring-2 focus:ring-[#3B0918]"
            aria-label="Close Menu"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>

        <ul className="flex-1 px-8 py-12 flex flex-col gap-8 relative z-10">
          {links.map((link, idx) => (
            <li 
              key={link}
              className={`transition-all duration-700 delay-${idx * 100} ${
                show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <a 
                href="#" 
                className="group flex items-center justify-between font-serif text-3xl text-[#121212] hover:text-[#3B0918] transition-colors focus:outline-none"
              >
                <span>{link}</span>
                <ArrowRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 stroke-[1]" />
              </a>
            </li>
          ))}
        </ul>

        <div className="p-8 text-xs uppercase tracking-widest text-[#3B0918]/60 relative z-10">
          <p>Global Standard Time</p>
          <p className="mt-1">London • Paris • Tokyo • New York</p>
        </div>
      </nav>
    </div>
  );
};
