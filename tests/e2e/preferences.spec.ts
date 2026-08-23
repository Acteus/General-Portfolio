import { expect, test } from '@playwright/test';

test('reduced motion commits hydrated navigation without creating a journal leaf', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  await page.getByRole('button', { name: /project archive/i }).click();
  await expect(page.locator('[data-journal-chapter="project-archive"]')).toBeVisible();
  await expect(page.locator('.journal-leaf')).toHaveCount(0);
  await expect(page.locator('.journal-turn-layer')).toBeHidden();
});

test('increased contrast keeps focus and boundaries explicit', async ({ page }) => {
  await page.emulateMedia({ contrast: 'more' });
  await page.goto('/?mode=journal');
  await page.getByRole('button', { name: /project archive/i }).focus();
  await expect(page.getByRole('button', { name: /project archive/i })).toBeFocused();
  expect(await page.evaluate(() => window.matchMedia('(prefers-contrast: more)').matches)).toBe(true);
  await expect(page.locator('.journal-book')).toHaveCSS('border-top-width', '2px');
  await expect(page.locator('.recruiter-project').first()).toHaveCSS('border-top-width', '2px');
});
