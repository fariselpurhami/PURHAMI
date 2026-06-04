// packages/api-client/tests/fetcher.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { executeCommerceFetch } from '../src/core/fetcher';

// Mock serverConfig to prevent actual env dependency in pure tests
vi.mock('@purhami/config/server', () => ({
  serverConfig: { COMMERCE_API_URL: 'http://mock.local' }
}));

const MockSchema = z.object({ id: z.string() });

describe('executeCommerceFetch', () => {
  it('returns UNAVAILABLE on network failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network Down'));
    const res = await executeCommerceFetch({ path: '/test', schema: MockSchema });
    expect(res.success).toBe(false);
    if (!res.success) expect(res.error.code).toBe('UNAVAILABLE');
  });

  it('returns CONTRACT_MISMATCH on invalid payload', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ invalid_field: 123 }),
    });
    const res = await executeCommerceFetch({ path: '/test', schema: MockSchema });
    expect(res.success).toBe(false);
    if (!res.success) expect(res.error.code).toBe('CONTRACT_MISMATCH');
  });
});
