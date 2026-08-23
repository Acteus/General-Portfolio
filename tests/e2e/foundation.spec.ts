import { expect, test } from '@playwright/test';

test('serves the static Astro identity page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Garren Dullas — Cloud & Platform Engineer');
  await expect(page.getByRole('heading', { name: 'Garren Dullas' })).toBeVisible();
  await expect(page.getByText('Cloud & Platform Engineer', { exact: true })).toBeVisible();
});
