// packages/persistence/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding for PURHAMI...');

  // 1. إنشاء الفئات (Categories)
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

  // 2. إنشاء المنتجات بمتغيراتها (Products & Variants)
  await prisma.product.create({
    data: {
      slug: 'onyx-horizon-hoodie',
      title: 'Onyx Horizon Hoodie',
      descriptionHtml: '<p>Engineered for the Deep Dark Mode lifestyle. Matte finish, thermal retention.</p>',
      vendor: 'PURHAMI',
      categories: { connect: [{ id: apparelCategory.id }] },
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

  await prisma.product.create({
    data: {
      slug: 'neural-core-desk-mat',
      title: 'Neural Core Desk Mat',
      descriptionHtml: '<p>Edge-to-edge precision surface with chromatic edge glow threading.</p>',
      vendor: 'PURHAMI',
      categories: { connect: [{ id: hardwareCategory.id }] },
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

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
