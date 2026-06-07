// packages/domain/src/cart/entities/CartItem.ts
import { Entity } from '../../core/Entity';
import { Price } from '../../catalog/value-objects/Price';

export interface CartItemProps {
  variantId: string;
  sku: string;
  title: string;
  price: Price;
  quantity: number;
}

export class CartItem extends Entity<string> {
  private props: CartItemProps;

  private constructor(id: string, props: CartItemProps) {
    super(id);
    this.props = props;
  }

  public static create(id: string, props: CartItemProps): CartItem {
    if (props.quantity <= 0) throw new Error('Quantity must be greater than zero.');
    return new CartItem(id, props);
  }

  public get getProps() { return this.props; }
  public updateQuantity(qty: number) { this.props.quantity = qty; }
}
