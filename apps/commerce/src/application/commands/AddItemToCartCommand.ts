// apps/commerce/src/application/commands/AddItemToCartCommand.ts
import { RepositoryFactory } from '../../infrastructure/persistence/RepositoryFactory';
import { Cart, CartItem } from '@purhami/domain';
import { logger } from '@purhami/observability';

export class AddItemToCartCommand {
  static async execute(cartId: string, variantId: string, quantity: number): Promise<void> {
    const cartRepo = RepositoryFactory.getCartRepository();
    const productRepo = RepositoryFactory.getProductRepository();

    let cart = await cartRepo.findById(cartId);
    
    if (!cart) {
      logger.info({ cartId }, 'Cart not found. Initializing a new cart.');
      cart = Cart.create(cartId, { items: [] }); 
    }

    const variant = await productRepo.findVariantById(variantId);
    
    // 1. التأكد من وجود المتغير أولاً (فصل الأخطاء)
    if (!variant) {
      logger.error({ variantId }, 'VARIANT_NOT_FOUND: Could not find variant in DB');
      throw new Error('VARIANT_NOT_FOUND');
    }

    // 2. استخراج الخصائص بمرونة (يدعم الـ Domain Entity والـ Prisma Object)
    const vProps = typeof (variant as any).getProps === 'function' ? (variant as any).getProps() : variant;

    // 🔍 كشاف معماري لمعرفة هيكل البيانات المستخرج
    logger.info({ inventoryQuantity: vProps?.inventoryQuantity, priceAmount: vProps?.priceAmount }, 'Extracted Variant Props');

    // 3. قراءة المخزون
    const availableQty = vProps?.inventory?.getProps?.().quantityAvailable ?? 
                         vProps?.inventory?.quantityAvailable ?? 
                         vProps?.inventoryQuantity ?? 0;

    // 4. التحقق من المخزون
    if (availableQty < quantity) {
      logger.error({ availableQty, requested: quantity }, 'INSUFFICIENT_INVENTORY: Stock is lower than requested quantity');
      throw new Error('INSUFFICIENT_INVENTORY');
    }

    // 5. قراءة السعر
    const priceValue = vProps?.price?.getProps?.().amount ?? 
                       vProps?.price?.amount ?? 
                       vProps?.priceAmount ?? 0;

    const item = CartItem.create(crypto.randomUUID(), {
      variantId,
      sku: vProps?.sku || 'UNKNOWN-SKU',
      title: vProps?.title || 'Unknown Product',
      price: priceValue,
      quantity
    });

    cart.addItem(item);
    await cartRepo.save(cart);

    logger.info({ cartId, variantId }, 'Item successfully added to cart');
  }
}
