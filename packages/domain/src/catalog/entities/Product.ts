// packages/domain/src/catalog/entities/Product.ts
import { Entity } from '../../core/Entity';
import { Variant } from './Variant';

export interface ProductProps {
  slug: string;
  title: string;
  vendor: string;
  descriptionHtml: string;
  variants: Variant[];
  images: Array<{ url: string; altText: string }>;
  categoryIds: string[];
}

export class Product extends Entity<string> {
  private props: ProductProps;

  private constructor(id: string, props: ProductProps) {
    super(id);
    this.props = props;
  }

  public static create(id: string, props: ProductProps): Product {
    if (props.variants.length === 0) {
      throw new Error('A product must have at least one variant.');
    }
    return new Product(id, props);
  }

  public get getProps() { return this.props; }
}
