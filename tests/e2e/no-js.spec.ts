import { expect, test } from '@playwright/test';

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

test('reduced motion commits navigation without creating a journal leaf', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  await page.getByRole('button', { name: /project archive/i }).click();
  await expect(page.locator('[data-journal-chapter="project-archive"]')).toBeVisible();
  await expect(page.locator('.journal-leaf')).toHaveCount(0);
});

test('reduced transparency keeps the journal content readable', async ({ page }) => {
  await page.addInitScript(() => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (query) => {
      if (query === '(prefers-reduced-transparency: reduce)') {
        return { matches: true, media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } } as MediaQueryList;
      }
      return originalMatchMedia.call(window, query);
    };
  });
  await page.goto('/?mode=journal');
  await expect(page.getByRole('heading', { name: /field journal/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Project Archive' }).first()).toBeVisible();
  expect(await page.evaluate(() => window.matchMedia('(prefers-reduced-transparency: reduce)').matches)).toBe(true);
  await expect(page.locator('details[data-journal-chapter]')).toHaveCount(5);
});

test('increased contrast keeps focus and boundaries explicit', async ({ page }) => {
  await page.addInitScript(() => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (query) => {
      if (query === '(prefers-contrast: more)') {
        return { matches: true, media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } } as MediaQueryList;
      }
      return originalMatchMedia.call(window, query);
    };
  });
  await page.goto('/?mode=journal');
  await page.getByRole('button', { name: /project archive/i }).focus();
  await expect(page.getByRole('button', { name: /project archive/i })).toBeFocused();
  expect(await page.evaluate(() => window.matchMedia('(prefers-contrast: more)').matches)).toBe(true);
  await expect(page.locator('details[data-journal-chapter]')).toHaveCount(5);
});
