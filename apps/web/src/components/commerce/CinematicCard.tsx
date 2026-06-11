'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

export const CinematicCard = ({ product, velocity = 0, index = 0 }: any) => {
  const itemRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const title = product?.title || 'Unknown Prototype';
  const sku = product?.variants?.[0]?.sku || 'UNKNOWN-SKU';
  const imageUrl = product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?q=80&w=2824&auto=format&fit=crop';
  const slug = product?.slug || '#';
  
  const speed = 1; 
  const align = index % 2 === 0 ? 'justify-start' : 'justify-end'; 
  const aspect = index % 2 === 0 ? 'aspect-[4/5]' : 'aspect-[3/4]'; 
  
  useEffect(() => {
    if (!itemRef.current || !imageRef.current) return;
    const skew = velocity * 0.05;
    const rotate = velocity * 0.01;
    itemRef.current.style.transform = `skewY(${skew}deg) rotate(${rotate}deg)`;
    const parallaxY = velocity * 0.2 * speed;
    imageRef.current.style.transform = `scale(1.15) translate3d(0, ${parallaxY}px, 0)`;
  }, [velocity, speed]);

  return (
    <div className={`w-full flex ${align} mb-40 md:mb-64 px-6 md:px-24`}>
      {/* 🚀 التحديث هنا: تغليف الكارت بـ Link */}
      <Link href={`/products/${slug}`} className="block w-full md:w-[45vw]">
        <article 
          ref={itemRef}
          className={`relative w-full h-full ${aspect} group cursor-pointer will-change-transform`}
          style={{ transformOrigin: 'center center' }}
        >
          <div className="absolute inset-0 overflow-hidden bg-obsidian">
            <img 
              ref={imageRef}
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 will-change-transform"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full px-12 opacity-0 group-hover:opacity-100 transition-all duration-700 z-10 pointer-events-none">
            <div className="transform -translate-x-12 group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <h3 className="font-serif text-4xl md:text-5xl text-ivory mb-4 drop-shadow-2xl">{title}</h3>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-bloodline font-bold">
                {sku}
              </p>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
};
