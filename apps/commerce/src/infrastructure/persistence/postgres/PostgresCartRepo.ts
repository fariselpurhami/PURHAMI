// apps/commerce/src/infrastructure/persistence/postgres/PostgresCartRepo.ts
import { PrismaClient } from '@prisma/client';
import { ICartRepository } from '@purhami/domain';

export class PostgresCartRepo implements ICartRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<any | null> {
    const cartRecord = await this.prisma.cart.findUnique({
      where: { id },
      include: { items: true },
    });
    
    if (!cartRecord) return null;
    return cartRecord;
  }

  async save(cart: any): Promise<void> {
    // استخراج الخصائص من كائن النطاق (Domain Entity)
    const props = cart.getProps ? cart.getProps() : cart;
    
    // استخدام Transaction لضمان سلامة البيانات (ACID Compliance)
    await this.prisma.$transaction(async (tx) => {
      // 1. تحديث أو إنشاء السلة
      await tx.cart.upsert({
        where: { id: props.id },
        update: { updatedAt: new Date() },
        create: { id: props.id, userId: props.userId },
      });

      // 2. مسح العناصر القديمة وإدخال الجديدة (طريقة الـ Sync السريعة للسلة)
      await tx.cartItem.deleteMany({ where: { cartId: props.id } });
      
      if (props.items && props.items.length > 0) {
        await tx.cartItem.createMany({
          data: props.items.map((item: any) => ({
            id: item.id || crypto.randomUUID(), // ضمان وجود ID
            cartId: props.id,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        });
      }
    });
  }
}
