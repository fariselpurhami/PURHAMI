// apps/commerce/tests/integration/endpoints.spec.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { setupDomainErrorHandler } from '../../src/presentation/http/middleware/DomainErrorHandler';
import { catalogRoutes } from '../../src/presentation/http/routes/catalog.routes';
import { healthRoutes } from '../../src/presentation/http/routes/health.routes';
import { env } from '../../src/config/env';

let app: FastifyInstance;

beforeAll(async () => {
  app = Fastify();
  setupDomainErrorHandler(app);
  await app.register(healthRoutes, { prefix: '/health' });
  await app.register(catalogRoutes, { prefix: '/internal/v1/catalog' });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('Commerce HTTP Boundary', () => {
  it('responds to liveness probe immediately', async () => {
    const response = await app.inject({ method: 'GET', url: '/health/liveness' });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.status).toBe('ok');
    expect(body.service).toBe('commerce');
  });

  it('translates Domain ProductNotFoundError to HTTP 404', async () => {
    // Enable fixtures to bypass the 503 persistence error, allowing the 404 logic to execute
    env.ALLOW_LOCAL_FIXTURES = true;
    
    const response = await app.inject({ method: 'GET', url: '/internal/v1/catalog/products/missing-id' });
    
    expect(response.statusCode).toBe(404);
    const body = JSON.parse(response.payload);
    expect(body.error).toContain('not found');
  });

  it('translates Domain PersistenceNotConnectedError to HTTP 503', async () => {
    // Disable fixtures to force the Postgres adapter to throw the unprovisioned error
    env.ALLOW_LOCAL_FIXTURES = false;
    
    const response = await app.inject({ method: 'GET', url: '/internal/v1/catalog/products/fix_123' });
    
    expect(response.statusCode).toBe(503);
    const body = JSON.parse(response.payload);
    expect(body.error).toContain('is not connected');
  });
});
