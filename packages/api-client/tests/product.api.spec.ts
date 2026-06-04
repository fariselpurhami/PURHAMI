// packages/api-client/tests/product.api.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { getProductById } from '../src/catalog/product.api';

vi.mock('@purhami/config/server', () => ({
  serverConfig: { COMMERCE_API_URL: 'http://mock.local' }
}));

describe('getProductById', () => {
  it('handles 404 cleanly without throwing', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    const res = await getProductById('123');
    expect(res.success).toBe(false);
    if (!res.success) expect(res.error.code).toBe('NOT_FOUND');
  });
});
