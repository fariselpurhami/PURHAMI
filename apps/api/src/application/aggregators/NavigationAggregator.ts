import { fetchFromCMS } from '../../infrastructure/downstream/CMSAdapter';
import { MegaMenu, MegaMenuSchema } from '@purhami/contracts';
import { logger } from '@purhami/observability';

export class NavigationAggregator {
  static async getMegaMenuAggregate(): Promise<MegaMenu> {
    const response = await fetchFromCMS(`/internal/v1/navigation`);
    
    if (!response.ok) {
      logger.error({ status: response.status }, 'CMS service returned non-200');
      throw new Error('CMS downstream unavailable');
    }

    const rawData = await response.json();
    
    const parsed = MegaMenuSchema.safeParse(rawData);
    if (!parsed.success) {
      logger.error({ error: parsed.error.format() }, 'CMS payload contract mismatch');
      throw new Error('CONTRACT_MISMATCH');
    }

    return parsed.data;
  }
}
