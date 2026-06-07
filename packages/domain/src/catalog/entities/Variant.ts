// packages/domain/src/catalog/entities/Variant.ts
import { Entity } from '../../core/Entity';
import { Price } from '../value-objects/Price';
import { InventoryLevel } from '../value-objects/InventoryLevel';

export interface VariantProps {
  sku: string;
  title: string;
  price: Price;
  inventory: InventoryLevel;
  compareAtPrice?: Price;
  options: Record<string, string>; // e.g., { Color: 'Oxblood', Size: 'M' }
}

export class Variant extends Entity<string> {
  private props: VariantProps;

  private constructor(id: string, props: VariantProps) {
    super(id);
    this.props = props;
  }

  public static create(id: string, props: VariantProps): Variant {
    if (!props.sku) throw new Error('Variant requires a SKU.');
    return new Variant(id, props);
  }

  public get getProps() { return this.props; }
}
