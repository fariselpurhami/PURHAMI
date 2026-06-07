// packages/domain/src/catalog/entities/Category.ts
import { Entity } from '../../core/Entity';

export interface CategoryProps {
  slug: string;
  name: string;
  description?: string;
  parentId?: string;
  order: number;
}

export class Category extends Entity<string> {
  private props: CategoryProps;

  private constructor(id: string, props: CategoryProps) {
    super(id);
    this.props = props;
  }

  public static create(id: string, props: CategoryProps): Category {
    return new Category(id, props);
  }

  public get getProps() { return this.props; }
}
