// apps/commerce/src/application/commands/AddItemToCartCommand.ts
import { RepositoryFactory } from '../../infrastructure/persistence/RepositoryFactory';
import { CartItem } from '@purhami/domain';
import { logger } from '@purhami/observability';

export class AddItemToCartCommand {
  static async execute(cartId: string, variantId: string, quantity: number): Promise<void> {
    const cartRepo = RepositoryFactory.getCartRepository();
    const productRepo = RepositoryFactory.getProductRepository();

    const cart = await cartRepo.findById(cartId);
    if (!cart) throw new Error('CART_NOT_FOUND');

    // Business Logic: Validate Inventory
    const variant = await productRepo.findVariantById(variantId);
    
    // قراء آمنة لخصائص الـ Variant سواء كانت دالة getProps() أو كائن مسطح
    const vProps = variant ? (variant as any).getProps : null;
    const props = typeof vProps === 'function' ? vProps() : vProps;

    // الوصول الآمن لكمية المخزون المتاحة من الـ Value Object
    const availableQty = props?.inventory?.getProps?.().quantityAvailable ?? 
                         props?.inventory?.quantityAvailable ?? 
                         props?.inventoryQuantity ?? 0;

    if (!variant || availableQty < quantity) {
      throw new Error('INSUFFICIENT_INVENTORY');
    }

    // استخراج السعر بطريقة متوافقة مع الـ Value Object الخاص بالـ Domain
    const priceValue = props.price?.getProps?.().amount ?? props.price?.amount ?? props.price ?? 0;

    const item = CartItem.create(crypto.randomUUID(), {
      variantId,
      sku: props.sku,
      title: props.title,
      price: priceValue,
      quantity
    });

    cart.addItem(item);
    await cartRepo.save(cart);

    logger.info({ cartId, variantId }, 'Item added to cart');
  }
}
