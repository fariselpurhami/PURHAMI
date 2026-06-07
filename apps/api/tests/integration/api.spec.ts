// apps/api/tests/integration/api.spec.ts
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { setupGlobalErrorHandler } from '../../src/presentation/http/middleware/GlobalErrorHandler';
import { healthRoutes } from '../../src/presentation/http/routes/health.routes';
import { catalogRoutes } from '../../src/presentation/http/routes/catalog.routes';

// Mock aggregators to prevent real network calls during integration testing
vi.mock('../../src/application/aggregators/CatalogAggregator', () => ({
  CatalogAggregator: {
    getProductAggregate: vi.fn(),
  }
}));

import { CatalogAggregator } from '../../src/application/aggregators/CatalogAggregator';

let app: FastifyInstance;

beforeAll(async () => {
  app = Fastify();
  setupGlobalErrorHandler(app);
  await app.register(healthRoutes, { prefix: '/health' });
  await app.register(catalogRoutes, { prefix: '/api/v1/catalog' });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('API Gateway Integration', () => {
  it('responds to liveness probe immediately', async () => {
    const response = await app.inject({ method: 'GET', url: '/health/liveness' });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toHaveProperty('status', 'ok');
  });

  it('maps aggregator 404s to standard normalized error structures', async () => {
    (CatalogAggregator.getProductAggregate as any).mockResolvedValue(null);
    
    const response = await app.inject({ method: 'GET', url: '/api/v1/catalog/products/invalid-id' });
    
    expect(response.statusCode).toBe(404);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('intercepts thrown CONTRACT_MISMATCH errors and maps them to 502 Bad Gateway', async () => {
    (CatalogAggregator.getProductAggregate as any).mockRejectedValue(new Error('CONTRACT_MISMATCH'));
    
    const response = await app.inject({ method: 'GET', url: '/api/v1/catalog/products/broken-id' });
    
    expect(response.statusCode).toBe(502);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('CONTRACT_MISMATCH');
  });
});
