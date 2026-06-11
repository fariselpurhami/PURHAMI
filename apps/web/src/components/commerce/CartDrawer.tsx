'use client';

import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { CartAPI } from '@purhami/api-client';

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) loadCart();
  }, [isOpen]);

  const loadCart = async () => {
    const cartId = localStorage.getItem('purhami_cart_id');
    if (!cartId) return;

    setIsLoading(true);
    try {
      const result = await CartAPI.getCart(cartId);
      if (result.success) setCart(result.data);
    } catch (error) {
      console.error('Cart visual error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (itemId: string) => {
    const cartId = localStorage.getItem('purhami_cart_id');
    if (!cartId) return;

    // تحديث الواجهة فوراً
    setCart((prev: any) => ({
      ...prev,
      items: prev.items.filter((i: any) => i.id !== itemId)
    }));

    // إرسال طلب الحذف للباك إند
    const result = await CartAPI.removeItem(cartId, itemId);
    if (result.success) {
      window.dispatchEvent(new Event('cart-updated'));
    } else {
      loadCart(); // في حالة الفشل نرجع الداتا الأصلية
    }
  };

  if (!isOpen) return null;

  const items = cart?.items || [];
  const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity duration-700 ease-in-out"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-obsidian border-l border-chrome/10 z-50 flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-chrome/10 bg-obsidian/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 text-ivory">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[10px] tracking-[0.4em] uppercase font-bold">Secure Cart</span>
          </div>
          <button onClick={onClose} className="text-chrome hover:text-bloodline transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 custom-scrollbar">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-[10px] tracking-widest text-chrome uppercase animate-pulse">
              Syncing Secure Core...
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <ShoppingBag className="w-12 h-12 text-chrome mb-4 stroke-[1]" />
              <div className="text-[10px] tracking-widest uppercase text-ivory">Cart is Empty</div>
            </div>
          ) : (
            items.map((item: any) => (
              <div key={item.id} className="flex gap-6 group relative">
                <div className="w-24 aspect-[3/4] bg-black overflow-hidden relative">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full border border-chrome/20 flex items-center justify-center text-[8px] tracking-widest text-chrome">NO IMG</div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="text-ivory font-serif text-lg leading-tight mb-2">{item.title}</h4>
                    {item.options && Object.entries(item.options).map(([key, value]: any) => (
                      <span key={key} className="text-[9px] tracking-widest uppercase text-chrome block">
                        {key}: <span className="text-ivory">{value}</span>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div className="text-bloodline font-mono text-sm tracking-widest">
                      ${(item.price / 100).toFixed(2)}
                    </div>
                    
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="text-[9px] tracking-widest uppercase text-chrome border-b border-transparent hover:border-bloodline hover:text-bloodline pb-0.5 transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Footer */}
        {items.length > 0 && (
          <div className="p-8 bg-black/40 backdrop-blur-lg border-t border-chrome/10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] text-chrome tracking-widest uppercase">Subtotal</span>
              <span className="text-ivory font-mono text-xl tracking-widest">${(total / 100).toFixed(2)}</span>
            </div>
            <button className="w-full py-5 bg-ivory text-obsidian text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-bloodline hover:text-ivory transition-all duration-500">
              Initialize Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
