'use client';

import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { HUD } from '../../../components/layout/HUD';
import { CartAPI } from '@purhami/api-client';

export function ProductClient({ product }: { product: any }) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const title = product?.title;
  const descriptionHtml = product?.descriptionHtml;
  const imageUrl = product?.images?.[0]?.url;
  const price = product?.variants?.[0]?.priceAmount ? `$${(product.variants[0].priceAmount / 100).toFixed(2)}` : 'N/A';
  
  const options = product?.variants?.[0]?.options || {};

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      let cartId = localStorage.getItem('purhami_cart_id');
      if (!cartId) {
        cartId = crypto.randomUUID();
        localStorage.setItem('purhami_cart_id', cartId);
      }

      // 🌟 التعديل هنا: رجعناها product.id لأن الـ Commerce بيدور على المنتج الأول
      const productId = product?.id;

      if (productId) {
        // 🚀 بنبعت الـ Product ID الأصلي
        const result = await CartAPI.addItem(cartId, productId, 1);
        
        if (result.success) {
          // إرسال إشارة التحديث للـ HUD
          window.dispatchEvent(new Event('cart-updated'));

          setAdded(true);
          setTimeout(() => setAdded(false), 2000);
        } else {
          console.error('Failed to add to cart:', result.error);
        }
      } else {
        console.error('Visual Error: Product ID is missing');
      }
    } catch (error) {
      console.error('Cart Error:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory font-sans selection:bg-bloodline selection:text-ivory">
      <HUD />
      
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-1/2 h-[60vh] lg:h-screen relative bg-black">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="w-full h-full flex items-center justify-center border border-chrome/20">
              <span className="text-chrome tracking-widest text-xs">NO VISUAL DATA</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent lg:hidden" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-obsidian hidden lg:block" />
          
          <Link href="/" className="absolute top-24 left-8 lg:left-12 flex items-center gap-4 text-xs tracking-[0.3em] uppercase text-ivory hover:text-bloodline transition-colors z-20">
            <ArrowLeft className="w-4 h-4" /> Return
          </Link>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-20 lg:py-0">
          <div className="max-w-lg">
            <span className="text-xs tracking-[0.4em] text-chrome uppercase mb-4 block">
              {product?.categories?.[0]?.name || 'Archive'}
            </span>
            
            <h1 className="font-serif text-5xl lg:text-7xl mb-8 leading-[0.9] tracking-tight text-ivory">
              {title}
            </h1>
            
            <div className="text-2xl font-mono tracking-widest text-bloodline mb-12">
              {price}
            </div>

            {Object.entries(options).length > 0 && (
              <div className="flex flex-wrap gap-8 mb-12 border-y border-chrome/20 py-6">
                {Object.entries(options).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-[10px] tracking-[0.3em] text-chrome uppercase block mb-2">{key}</span>
                    <span className="text-sm tracking-widest text-ivory uppercase">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}

            <div 
              className="text-sm text-chrome leading-relaxed mb-16 space-y-4 max-w-md"
              dangerouslySetInnerHTML={{ __html: descriptionHtml || '<p>Details classified.</p>' }}
            />

            <button 
              onClick={handleAddToCart}
              disabled={isAdding || added}
              className={`w-full py-6 flex justify-center items-center gap-4 text-xs tracking-[0.4em] uppercase font-bold transition-all duration-500 border ${
                added 
                  ? 'bg-bloodline border-bloodline text-ivory' 
                  : 'bg-transparent border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-obsidian'
              }`}
            >
              {isAdding ? 'Initializing...' : added ? <><Check className="w-4 h-4" /> Secured</> : 'Add To Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
