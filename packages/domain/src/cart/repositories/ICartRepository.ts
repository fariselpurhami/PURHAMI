// packages/domain/src/cart/repositories/ICartRepository.ts
import { Cart } from '../entities/Cart';

export interface ICartRepository {
  findById(id: string): Promise<Cart | null>;
  save(cart: Cart): Promise<void>;
}
