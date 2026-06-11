'use client';

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { CartDrawer } from '../commerce/CartDrawer';
import { CartAPI } from '@purhami/api-client';

export const HUD = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  // 🌟 دالة جلب عدد المنتجات في السلة
  const fetchCartCount = async () => {
    const cartId = localStorage.getItem('purhami_cart_id');
    if (!cartId) return;
    try {
      const result = await CartAPI.getCart(cartId);
      if (result.success && result.data?.items) {
        const count = result.data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setItemCount(count);
      }
    } catch (error) {
      console.error('Failed to sync HUD', error);
    }
  };

  useEffect(() => {
    fetchCartCount(); // أول ما الصفحة تفتح
    
    // 🎧 الاستماع لإشارة تحديث السلة من أي مكان في التطبيق
    window.addEventListener('cart-updated', fetchCartCount);
    return () => window.removeEventListener('cart-updated', fetchCartCount);
  }, []);

  return (
    <>
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
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-xs tracking-[0.2em] uppercase font-bold hover:text-bloodline transition-colors flex items-center gap-2"
          >
            {/* 🚀 النبض الحي للعداد */}
            <span>Cart</span>
            <span className={`transition-all duration-500 ${itemCount > 0 ? 'text-bloodline scale-110' : 'text-white/50'}`}>
              [{itemCount}]
            </span>
          </button>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
