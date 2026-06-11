import { getProducts } from '@purhami/api-client';
import { notFound } from 'next/navigation';
import { ProductClient } from './ProductClient';

export const revalidate = 60; 

// استخراج الـ slug من الرابط
export default async function ProductPage({ params }: { params: { slug: string } }) {
  // بنجيب المنتجات باستخدام الحارس المرن اللي عملناه
  const result = await getProducts();

  if (!result.success) {
    return notFound();
  }

  // فلترة المنتج المطلوب بناءً على الرابط
  const product = result.data.find((p: any) => p.slug === params.slug);

  if (!product) {
    return notFound();
  }

  return <ProductClient product={product} />;
}
