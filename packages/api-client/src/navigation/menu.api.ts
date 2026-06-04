// packages/api-client/src/navigation/menu.api.ts
import { MegaMenu, MegaMenuSchema } from '@purhami/contracts';
import { executeCommerceFetch } from '../core/fetcher';
import { CACHE_POLICIES } from '../core/cache';
import { Result } from '../core/error';

export async function getMegaMenu(): Promise<Result<MegaMenu>> {
  return executeCommerceFetch<MegaMenu>({
    path: `/api/v1/navigation`,
    schema: MegaMenuSchema,
    ...CACHE_POLICIES.NAVIGATION,
  });
}
