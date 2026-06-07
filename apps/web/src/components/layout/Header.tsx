'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ease-in-out ${
        scrolled ? 'py-4 bg-[#F9F8F6]/90 backdrop-blur-md shadow-sm' : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Navigation Button */}
        <button 
          onClick={onMenuClick}
          className="group flex items-center gap-3 text-[#3B0918] hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#3B0918] focus:ring-offset-4 focus:ring-offset-[#F9F8F6]"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 stroke-[1.5]" />
          <span className="text-xs uppercase tracking-[0.2em] font-medium hidden md:block">Menu</span>
        </button>

        {/* Brand Logo */}
        <a 
          href="/" 
          className="absolute left-1/2 -translate-x-1/2 focus:outline-none group"
          aria-label="Purhami Homepage"
        >
          <Image
            src="/PURHAMI.png"
            alt="PURHAMI"
            width={240}
            height={60}
            priority // إجباري هنا لأن اللوجو جزء من الـ LCP (Largest Contentful Paint)
            className="h-8 md:h-10 w-auto object-contain transition-opacity duration-500 group-hover:opacity-80"
          />
        </a>

        {/* Cart Button */}
        <button 
          className="group flex items-center gap-3 text-[#3B0918] hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#3B0918] focus:ring-offset-4 focus:ring-offset-[#F9F8F6]"
          aria-label="Shopping Cart"
        >
          <span className="text-xs uppercase tracking-[0.2em] font-medium hidden md:block">Cart [0]</span>
          <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>
    </header>
  );
};
