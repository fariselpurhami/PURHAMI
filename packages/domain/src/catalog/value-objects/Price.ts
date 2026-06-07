// packages/domain/src/catalog/value-objects/Price.ts
import { ValueObject } from '../../core/ValueObject';

interface PriceProps {
  amount: number;
  currencyCode: 'USD' | 'EUR' | 'GBP' | 'AED' | 'EGP';
}

export class Price extends ValueObject<PriceProps> {
  private constructor(props: PriceProps) {
    super(props);
  }

  public static create(amount: number, currencyCode: PriceProps['currencyCode']): Price {
    if (amount < 0) {
      throw new Error('Price cannot be negative.');
    }
    return new Price({ amount, currencyCode });
  }

  public format(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.props.currencyCode,
    }).format(this.props.amount / 100); // Assuming stored in cents/smallest unit
  }
}
