// packages/persistence/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding for PURHAMI...');

  // 0. تنظيف قاعدة البيانات لتجنب تكرار البيانات عند تشغيل السكريبت أكثر من مرة
  console.log('🧹 Cleaning existing data...');
  await prisma.productImage.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 1. إنشاء الفئات (Categories)
  console.log('📁 Creating Categories...');
  const apparelCategory = await prisma.category.create({
    data: {
      slug: 'apparel',
      name: 'Premium Apparel',
      description: 'Exclusive PURHAMI clothing line.',
      order: 1,
    },
  });

  const hardwareCategory = await prisma.category.create({
    data: {
      slug: 'hardware',
      name: 'Architectural Hardware',
      description: 'Systems and gear for the visionary.',
      order: 2,
    },
  });

  // 2. إنشاء المنتجات بمتغيراتها وصورها (Products, Variants & Images)
  console.log('💎 Forging Premium Products...');

  // المنتج الأول: Onyx Horizon Hoodie (تم تحديثه بالصور)
  await prisma.product.create({
    data: {
      slug: 'onyx-horizon-hoodie',
      title: 'Onyx Horizon Hoodie',
      descriptionHtml: '<p>Engineered for the Deep Dark Mode lifestyle. Matte finish, thermal retention.</p>',
      vendor: 'PURHAMI',
      categories: { connect: [{ id: apparelCategory.id }] },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2824&auto=format&fit=crop',
            altText: 'Onyx Horizon Hoodie - Front',
            order: 1
          }
        ]
      },
      variants: {
        create: [
          {
            sku: 'ONYX-HD-M',
            title: 'Medium',
            priceAmount: 12500, // $125.00
            inventoryQuantity: 50,
            options: { Size: 'M', Color: 'Oxblood' }
          },
          {
            sku: 'ONYX-HD-L',
            title: 'Large',
            priceAmount: 12500,
            inventoryQuantity: 30,
            options: { Size: 'L', Color: 'Oxblood' }
          }
        ]
      }
    }
  });

  // المنتج الثاني: Void-Weave Stealth Trench (منتج جديد فخم)
  await prisma.product.create({
    data: {
      slug: 'void-weave-stealth-trench',
      title: 'Void-Weave Stealth Trench',
      descriptionHtml: '<p>Architectural outer layer. Nano-coated matte surface for ultimate weather deflection. Geometric precision in every stitch.</p>',
      vendor: 'PURHAMI',
      categories: { connect: [{ id: apparelCategory.id }] },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2836&auto=format&fit=crop',
            altText: 'Void-Weave Stealth Trench',
            order: 1
          }
        ]
      },
      variants: {
        create: [
          {
            sku: 'VOID-TR-U',
            title: 'Universal Fit',
            priceAmount: 45000, // $450.00
            inventoryQuantity: 15,
            options: { Size: 'Universal', Color: 'Vantablack' }
          }
        ]
      }
    }
  });

  // المنتج الثالث: Neural Core Desk Mat (تم تحديثه بالصور)
  await prisma.product.create({
    data: {
      slug: 'neural-core-desk-mat',
      title: 'Neural Core Desk Mat',
      descriptionHtml: '<p>Edge-to-edge precision surface with chromatic edge glow threading. The foundation of your command center.</p>',
      vendor: 'PURHAMI',
      categories: { connect: [{ id: hardwareCategory.id }] },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?q=80&w=2824&auto=format&fit=crop',
            altText: 'Neural Core Desk Mat Setup',
            order: 1
          }
        ]
      },
      variants: {
        create: [
          {
            sku: 'NC-MAT-01',
            title: 'Extended',
            priceAmount: 4500, // $45.00
            inventoryQuantity: 100,
            options: { Size: 'Extended', Color: 'Matte Black' }
          }
        ]
      }
    }
  });

  // المنتج الرابع: Aero-Grade Titanium Key Fob (منتج هاردوير جديد)
  await prisma.product.create({
    data: {
      slug: 'aero-grade-titanium-fob',
      title: 'Aero-Grade Titanium Fob',
      descriptionHtml: '<p>Machined from a single block of aerospace-grade titanium. Monolithic design, weighted for presence.</p>',
      vendor: 'PURHAMI',
      categories: { connect: [{ id: hardwareCategory.id }] },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=2836&auto=format&fit=crop',
            altText: 'Titanium Hardware Detail',
            order: 1
          }
        ]
      },
      variants: {
        create: [
          {
            sku: 'AERO-TITAN-FB',
            title: 'Standard',
            priceAmount: 8500, // $85.00
            inventoryQuantity: 40,
            options: { Material: 'Titanium', Finish: 'Brushed Dark' }
          }
        ]
      }
    }
  });

  console.log('✅ Seeding completed successfully! The database is now armed.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
