// packages/api-client/tests/menu.api.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { getMegaMenu } from '../src/navigation/menu.api';

vi.mock('@purhami/config/server', () => ({
  serverConfig: { COMMERCE_API_URL: 'http://mock.local' }
}));

describe('getMegaMenu', () => {
  it('resolves valid menu payload', async () => {
    const mockData = [{ title: 'Mens', links: [] }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });
    const res = await getMegaMenu();
    expect(res.success).toBe(true);
    if (res.success) expect(res.data).toEqual(mockData);
  });
});
