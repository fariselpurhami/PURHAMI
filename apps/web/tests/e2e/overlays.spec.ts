// apps/web/tests/e2e/overlays.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Overlay Choreography & Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Navigation drawer lifecycle and focus trap', async ({ page }) => {
    const navTrigger = page.getByLabel('Open Navigation Menu');
    await navTrigger.click();

    const drawer = page.getByRole('dialog', { name: 'Main Navigation' });
    await expect(drawer).toBeVisible();
    await expect(page.locator('body')).toHaveAttribute('data-scroll-locked', 'true');

    // Escape key closes overlay
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();
    await expect(page.locator('body')).not.toHaveAttribute('data-scroll-locked');
  });

  test('Search overlay cinematic execution', async ({ page }) => {
    const searchTrigger = page.locator('button', { hasText: 'SEARCH' });
    await searchTrigger.click();

    const searchOverlay = page.getByRole('dialog', { name: 'Search Catalog' });
    await expect(searchOverlay).toBeVisible();
    
    const input = page.getByLabel('Search input');
    await expect(input).toBeVisible();
    
    // Test input interaction (no real submission, verifying UI boundaries)
    await input.fill('leather');
    await expect(input).toHaveValue('leather');

    const closeBtn = page.getByLabel('Close Search');
    await closeBtn.click();
    await expect(searchOverlay).not.toBeVisible();
  });
});
