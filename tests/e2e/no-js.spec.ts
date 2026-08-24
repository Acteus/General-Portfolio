import { expect, test } from '@playwright/test';

test.describe('JavaScript-disabled reading', () => {
  test.use({ javaScriptEnabled: false });

  test('keeps both factual modes readable without JavaScript', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /selected work/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /field journal/i })).toBeVisible();
    await expect(page.getByText('When source material becomes a system people can question.').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /resume/i }).first()).toHaveAttribute('href', /Garren-Dullas-Cloud-Platform-Resume\.pdf/);
  });

  test('keeps all journal chapters available without JavaScript', async ({ page }) => {
    await page.goto('/?mode=journal');
    await expect(page.locator('details[data-journal-chapter]')).toHaveCount(5);
    await expect(page.locator('details[data-journal-chapter="project-archive"]')).toBeVisible();
    await expect(page.locator('a[href="https://gdullas.kwadrateam.dev"]')).toHaveCount(0);
  });

  test('keeps journal index and legacy aliases as real anchors without JavaScript', async ({ page }) => {
    await page.goto('/?mode=journal#note-jobboard');
    await expect(page.locator('.journal-index a[href^="#chapter-"]')).toHaveCount(5);
    await expect(page.locator('#note-jobboard')).toHaveAttribute('href', '#chapter-jobboard-devops');
    await expect(page.locator('#note-private-work')).toHaveCount(1);
    await expect(page.locator('#note-private-work')).toContainText('JRU Atlas and LaborWise');
    await expect(page.getByRole('link', { name: 'Open JobBoard-DevOps' })).toBeVisible();
  });
});
