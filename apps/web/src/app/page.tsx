// apps/web/src/app/page.tsx
import { getProducts } from '@purhami/api-client'; 
import { StorefrontClient } from './StorefrontClient';

export const revalidate = 60; // Next.js ISR: تحديث الكاش كل 60 ثانية

export default async function FlagshipStorefront() {
  // استدعاء الدالة الجاهزة مباشرة من الـ API Client بتاعنا
  const result = await getProducts();

  if (!result.success) {
    console.error("🚨 Failed to load products from API:", result.error);
  }

  // إذا نجح يمرر البيانات، وإذا فشل يمرر مصفوفة فارغة لحماية الواجهة
  const products = result.success ? result.data : [];

  return <StorefrontClient products={products} />;
}
