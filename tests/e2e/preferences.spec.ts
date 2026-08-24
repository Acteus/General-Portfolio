import { expect, test } from '@playwright/test';

test('reduced motion commits hydrated navigation without creating a journal leaf', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  await page.locator('.journal-index a[data-journal-target="project-archive"]').click();
  await expect(page.locator('[data-journal-chapter="project-archive"]')).toBeVisible();
  await expect(page.locator('.journal-leaf')).toHaveCount(0);
  await expect(page.locator('.journal-turn-layer')).toBeHidden();
});

test('increased contrast keeps focus and boundaries explicit', async ({ page }) => {
  await page.emulateMedia({ contrast: 'more' });
  await page.goto('/?mode=journal');
  await page.locator('.journal-index a[data-journal-target="project-archive"]').focus();
  await expect(page.locator('.journal-index a[data-journal-target="project-archive"]')).toBeFocused();
  expect(await page.evaluate(() => window.matchMedia('(prefers-contrast: more)').matches)).toBe(true);
  await expect(page.locator('.journal-book')).toHaveCSS('border-top-width', '2px');
  await expect(page.locator('.recruiter-project').first()).toHaveCSS('border-top-width', '2px');
});
