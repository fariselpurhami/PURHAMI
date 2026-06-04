// apps/web/tests/smoke/routing.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Production Route Smoke Tests', () => {
  test('Homepage mounts with architectural shell and no 500s', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    
    // Verify brand typography and structural rendering
    await expect(page.locator('h1')).toContainText('Power, Vision, and Precision.');
    await expect(page.locator('footer')).toBeVisible();
  });

  test('Collection route renders empty architectural state safely', async ({ page }) => {
    const response = await page.goto('/collection/mens-ready-to-wear');
    expect(response?.status()).toBe(200);
    
    // Verify dynamic slug extraction and zero-data handling
    await expect(page.locator('h1')).toContainText('MENS READY TO WEAR');
    await expect(page.getByLabel('Collection Products')).toBeVisible();
  });

  test('Product route renders pending state without mocked data', async ({ page }) => {
    const response = await page.goto('/product/123e4567-e89b-12d3-a456-426614174000');
    expect(response?.status()).toBe(200);
    
    await expect(page.locator('text=Title Unavailable')).toBeVisible();
    await expect(page.locator('text=Add to Bag — Unavailable')).toBeDisabled();
  });

  test('Non-existent deep routes trigger intentional 404', async ({ page }) => {
    const response = await page.goto('/undefined-route-123');
    expect(response?.status()).toBe(404);
    
    await expect(page.locator('h1')).toContainText('This destination is unmapped');
  });
});
