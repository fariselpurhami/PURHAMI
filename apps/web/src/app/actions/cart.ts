'use server'

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function addToCartAction(variantId: string, quantity: number) {
  // في نظام حقيقي، نقوم بقراءة cartId من الـ Cookie أو قاعدة البيانات
  // للتبسيط الآن، سنفترض ID ثابت لسلة تجريبية
  const cartId = cookies().get('cart_id')?.value || 'demo-cart-id-123'; 
  
  try {
    const res = await fetch(`http://localhost:4000/api/v1/carts/${cartId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId, quantity }),
      cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || 'Failed to add item to cart' };
    }

    // لتحديث واجهة المستخدم (مثل رقم العداد فوق أيقونة السلة)
    revalidateTag('cart');
    
    return { success: true };
  } catch (err) {
    return { error: 'API Gateway is down' };
  }
}
