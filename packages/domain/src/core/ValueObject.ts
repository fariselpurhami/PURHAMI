// packages/domain/src/core/ValueObject.ts
export abstract class ValueObject<Props> {
  public readonly props: Props;

  protected constructor(props: Props) {
    this.props = Object.freeze(props);
  }

  public equals(vo?: ValueObject<Props>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
