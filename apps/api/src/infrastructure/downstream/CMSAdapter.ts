// apps/api/src/infrastructure/downstream/CMSAdapter.ts
import { env } from '../../config/env';
import { getCorrelationId, logger } from '@purhami/observability';

export async function fetchFromCMS(path: string, options: RequestInit = {}): Promise<Response> {
  const url = `${env.DOWNSTREAM_CMS_URL}${path}`;
  const correlationId = getCorrelationId();
  
  logger.info({ url, method: options.method || 'GET' }, 'Dispatching to CMS Downstream');
  
  const headers = new Headers(options.headers);
  headers.set('x-request-id', correlationId);
  headers.set('Content-Type', 'application/json');

  return fetch(url, { ...options, headers });
}
