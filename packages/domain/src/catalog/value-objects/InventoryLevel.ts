// packages/domain/src/catalog/value-objects/InventoryLevel.ts
import { ValueObject } from '../../core/ValueObject';

type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

interface InventoryProps {
  quantityAvailable: number;
  lowStockThreshold: number;
}

export class InventoryLevel extends ValueObject<InventoryProps> {
  private constructor(props: InventoryProps) {
    super(props);
  }

  public static create(quantityAvailable: number, lowStockThreshold: number = 5): InventoryLevel {
    if (quantityAvailable < 0) throw new Error('Inventory cannot be negative.');
    return new InventoryLevel({ quantityAvailable, lowStockThreshold });
  }

  public getStatus(): InventoryStatus {
    if (this.props.quantityAvailable === 0) return 'OUT_OF_STOCK';
    if (this.props.quantityAvailable <= this.props.lowStockThreshold) return 'LOW_STOCK';
    return 'IN_STOCK';
  }

  public isAvailable(): boolean {
    return this.props.quantityAvailable > 0;
  }
}
