// apps/commerce/src/application/queries/GetProductByIdQuery.ts
import { RepositoryFactory } from '../../infrastructure/persistence/RepositoryFactory';
import { CatalogMapper } from '../dtos/CatalogMapper';
import { ProductNotFoundError } from '@purhami/domain';
import { Product as ContractProduct } from '@purhami/contracts';

export class GetProductByIdQuery {
  static async execute(id: string): Promise<ContractProduct> {
    const repo = RepositoryFactory.getProductRepository();
    const product = await repo.findById(id);

    if (!product) {
      throw new ProductNotFoundError(id);
    }

    return CatalogMapper.toProductContract(product);
  }
}
