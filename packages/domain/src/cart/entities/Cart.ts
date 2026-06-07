// packages/domain/src/cart/entities/Cart.ts
import { Entity } from '../../core/Entity';
import { CartItem } from './CartItem';

export interface CartProps {
  userId?: string;
  items: CartItem[];
  updatedAt: Date;
}

export class Cart extends Entity<string> {
  private props: CartProps;

  private constructor(id: string, props: CartProps) {
    super(id);
    this.props = props;
  }

  public static create(id: string, props: CartProps): Cart {
    return new Cart(id, props);
  }

  public addItem(item: CartItem): void {
    const existing = this.props.items.find(i => i.getProps.variantId === item.getProps.variantId);
    if (existing) {
      existing.updateQuantity(existing.getProps.quantity + item.getProps.quantity);
    } else {
      this.props.items.push(item);
    }
    this.props.updatedAt = new Date();
  }

  public get getProps() { return this.props; }
}
