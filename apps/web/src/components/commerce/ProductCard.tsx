'use client';

import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  image: string;
  status: string;
}

export const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article 
      className="group cursor-pointer flex flex-col gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE8E3]">
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-[1200ms] ease-release ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          loading={index > 1 ? "lazy" : "eager"}
        />
        <div 
          className={`absolute inset-0 bg-[#3B0918]/10 mix-blend-multiply transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} 
        />
      </div>
      <div className="flex justify-between items-baseline font-sans text-sm uppercase tracking-wide">
        <h3 className="text-[#121212] font-medium">{product.name}</h3>
        <span className="text-[#3B0918]">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency, maximumFractionDigits: 0 }).format(product.price)}
        </span>
      </div>
      <p className="text-xs text-[#121212]/50 uppercase tracking-widest">{product.category}</p>
    </article>
  );
};
