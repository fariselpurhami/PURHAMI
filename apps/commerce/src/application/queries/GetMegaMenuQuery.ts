// apps/commerce/src/application/queries/GetMegaMenuQuery.ts
import { RepositoryFactory } from '../../infrastructure/persistence/RepositoryFactory';
import { CatalogMapper } from '../dtos/CatalogMapper';
import { MegaMenu as ContractMegaMenu } from '@purhami/contracts';

export class GetMegaMenuQuery {
  static async execute(): Promise<ContractMegaMenu> {
    const repo = RepositoryFactory.getCategoryRepository();
    const categories = await repo.findTree();
    return CatalogMapper.toMegaMenuContract(categories);
  }
}
