// apps/web/tests/e2e/hydration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Hydration & Integration Boundary Safety', () => {
  test('Degraded navigation resolves without throwing 500', async ({ page }) => {
    // Navigating to the homepage which loads the StoreLayout and fetches navigation
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // Trigger overlay to ensure structural UI is unblocked by missing data
    await page.getByLabel('Open Navigation Menu').click();
    const navPanel = page.getByRole('dialog', { name: 'Main Navigation' });
    await expect(navPanel).toBeVisible();
    
    // We expect either live data or the controlled degraded message, not a system crash
    const hasData = await navPanel.locator('a').count() > 0;
    if (!hasData) {
      await expect(navPanel.locator('text=Navigation structure is currently offline.')).toBeVisible();
    }
  });

  test('Missing product route correctly halts execution to 404', async ({ page }) => {
    // Assuming backend returns 404 for this UUID
    const response = await page.goto('/product/00000000-0000-0000-0000-000000000000');
    expect(response?.status()).toBe(404);
    
    // Validates that api-client NOT_FOUND bubbles to Next.js notFound()
    await expect(page.locator('h1')).toContainText('This destination is unmapped');
  });
});
