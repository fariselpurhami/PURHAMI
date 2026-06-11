// apps/commerce/src/infrastructure/persistence/postgres/PostgresCartRepo.ts
import { PrismaClient } from '@prisma/client';
import { logger } from '@purhami/observability';

export class PostgresCartRepo {
  constructor(private prisma: PrismaClient) {}

  async findById(cartId: string): Promise<any | null> {
    const cartRecord = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true }
    });
    
    if (!cartRecord) return null;

    return {
      ...cartRecord,
      addItem: function(item: any) {
        if (!this.items) this.items = [];
        this.items.push(item);
      }
    };
  }

  async save(cart: any): Promise<void> {
    try {
      const rawId = cart.id || cart.props?.id || cart.getProps?.()?.id;
      const actualCartId = typeof rawId === 'object' ? rawId.value : String(rawId);

      const rawItems = cart.items || cart.props?.items || cart.getProps?.()?.items || [];
      
      // 🚀 التطابق التام مع الـ Schema: إرسال المتغير والكمية فقط
      const mappedItems = rawItems.map((item: any) => {
        const itemProps = item.props || (typeof item.getProps === 'function' ? item.getProps() : item);
        const itemId = item.id || itemProps.id || crypto.randomUUID();
        
        return {
          id: typeof itemId === 'object' ? itemId.value : String(itemId),
          variantId: itemProps.variantId,
          quantity: itemProps.quantity
          // تم إزالة السعر تماماً لاحترام التصميم المعماري لقاعدة البيانات
        };
      });

      await this.prisma.$transaction(async (tx) => {
        await tx.cart.upsert({
          where: { id: actualCartId },
          update: {},
          create: { id: actualCartId }
        });

        await tx.cartItem.deleteMany({
          where: { cartId: actualCartId }
        });

        if (mappedItems.length > 0) {
          await tx.cartItem.createMany({
            data: mappedItems.map((mi: any) => ({
              ...mi,
              cartId: actualCartId
            }))
          });
        }
      });

      logger.info({ cartId: actualCartId, itemsCount: mappedItems.length }, '✅ Cart successfully persisted to Postgres');
    } catch (error) {
      logger.error({ error }, '❌ Failed to save cart to Postgres');
      throw error;
    }
  }
}
