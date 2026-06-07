// apps/identity/tests/integration/auth.spec.ts
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { setupIdentityErrorHandler } from '../../src/presentation/http/middleware/IdentityErrorHandler';
import { authRoutes } from '../../src/presentation/http/routes/auth.routes';
import { healthRoutes } from '../../src/presentation/http/routes/health.routes';
import { PasswordService } from '../../src/application/services/PasswordService';

// Mock the database to prevent real network calls during CI
vi.mock('@purhami/persistence', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    $queryRaw: vi.fn(),
  }
}));

import { prisma } from '@purhami/persistence';

let app: FastifyInstance;
let validHash: string;
let validSalt: string;

beforeAll(async () => {
  app = Fastify();
  setupIdentityErrorHandler(app);
  await app.register(healthRoutes, { prefix: '/health' });
  await app.register(authRoutes, { prefix: '/internal/v1/auth' });
  await app.ready();

  // Generate a real hash for the mocked user to pass the crypto timingSafeEqual check
  const credentials = await PasswordService.hash('SecurePass123!');
  validHash = credentials.hash;
  validSalt = credentials.salt;
});

afterAll(async () => {
  await app.close();
});

describe('Identity HTTP Boundary', () => {
  describe('GET /health/liveness', () => {
    it('responds immediately to infrastructure probes', async () => {
      const response = await app.inject({ method: 'GET', url: '/health/liveness' });
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload).status).toBe('ok');
    });
  });

  describe('POST /internal/v1/auth/login', () => {
    it('returns 401 INVALID_CREDENTIALS for an unknown user', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      const response = await app.inject({
        method: 'POST',
        url: '/internal/v1/auth/login',
        payload: { email: 'ghost@purhami.com', password: 'password123' }
      });

      expect(response.statusCode).toBe(401);
      expect(JSON.parse(response.payload).error).toContain('Invalid');
    });

    it('returns 200 and a JWT for valid credentials', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({
        id: 'usr_123',
        email: 'admin@purhami.com',
        passwordHash: validHash,
        salt: validSalt,
        role: 'ADMIN',
        isActive: true,
      });

      const response = await app.inject({
        method: 'POST',
        url: '/internal/v1/auth/login',
        payload: { email: 'admin@purhami.com', password: 'SecurePass123!' }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.success).toBe(true);
      expect(body.accessToken).toBeDefined();
      expect(typeof body.accessToken).toBe('string');
      expect(body.accessToken.split('.').length).toBe(3); // Standard JWT format
    });
  });

  describe('POST /internal/v1/auth/verify', () => {
    it('returns 401 INVALID_TOKEN for a malformed token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/internal/v1/auth/verify',
        payload: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.malformed.signature' }
      });

      expect(response.statusCode).toBe(401);
      expect(JSON.parse(response.payload).error).toContain('expired or invalid');
    });
  });
});
