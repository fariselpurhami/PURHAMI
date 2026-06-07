'use client';

import React, { useEffect, useRef } from 'react';

interface Product {
  sku: string;
  name: string;
  category: string;
  price: number;
  image: string;
  speed: number;
  aspect: string;
  align: string;
}

interface Props {
  product: Product;
  velocity: number;
  index: number;
}

export const CinematicCard = ({ product, velocity }: Props) => {
  const itemRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (!itemRef.current || !imageRef.current) return;
    
    const skew = velocity * 0.05;
    const rotate = velocity * 0.01;
    itemRef.current.style.transform = `skewY(${skew}deg) rotate(${rotate}deg)`;
    
    const parallaxY = velocity * 0.2 * product.speed;
    imageRef.current.style.transform = `scale(1.15) translate3d(0, ${parallaxY}px, 0)`;
  }, [velocity, product.speed]);

  return (
    <div className={`w-full flex ${product.align} mb-40 md:mb-64 px-6 md:px-24`}>
      <article 
        ref={itemRef}
        className={`relative w-full md:w-[45vw] ${product.aspect} group cursor-pointer will-change-transform`}
        style={{ transformOrigin: 'center center' }}
      >
        <div className="absolute inset-0 overflow-hidden bg-obsidian">
          <img 
            ref={imageRef}
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 will-change-transform"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
        </div>
        
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full px-12 opacity-0 group-hover:opacity-100 transition-all duration-700 z-10 pointer-events-none">
          <div className="transform -translate-x-12 group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <h3 className="font-serif text-4xl md:text-5xl text-ivory mb-4 drop-shadow-2xl">{product.name}</h3>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-bloodline font-bold">
              {product.sku}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};
