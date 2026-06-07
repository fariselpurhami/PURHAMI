// apps/api/src/infrastructure/downstream/CommerceAdapter.ts
import { env } from '../../config/env';
import { getCorrelationId, logger } from '@purhami/observability';

export async function fetchFromCommerce(path: string, options: RequestInit = {}): Promise<Response> {
  const url = `${env.DOWNSTREAM_COMMERCE_URL}${path}`;
  const correlationId = getCorrelationId();
  
  logger.info({ url, method: options.method || 'GET' }, 'Dispatching to Commerce Downstream');
  
  const headers = new Headers(options.headers);
  headers.set('x-request-id', correlationId);
  headers.set('Content-Type', 'application/json');

  return fetch(url, { ...options, headers });
}
