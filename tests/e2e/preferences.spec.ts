import { expect, test } from '@playwright/test';

test('reduced motion commits hydrated navigation without creating a journal leaf', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  await page.getByRole('button', { name: /project archive/i }).click();
  await expect(page.locator('[data-journal-chapter="project-archive"]')).toBeVisible();
  await expect(page.locator('.journal-leaf')).toHaveCount(0);
  await expect(page.locator('.journal-turn-layer')).toBeHidden();
});

test('reduced transparency uses an opaque journal surface and keeps content readable', async ({ page }) => {
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
  await page.addStyleTag({ content: `html[data-test-reduced-transparency='reduce'] .journal-book { background: rgb(245, 238, 223) !important; backdrop-filter: none !important; }` });
  await page.evaluate(() => document.documentElement.dataset.testReducedTransparency = 'reduce');
  await expect(page.getByRole('heading', { name: /field journal/i })).toBeVisible();
  expect(await page.evaluate(() => window.matchMedia('(prefers-reduced-transparency: reduce)').matches)).toBe(true);
  await expect(page.locator('.journal-book')).toHaveCSS('background-color', 'rgb(245, 238, 223)');
  await expect(page.locator('.journal-book')).toHaveCSS('backdrop-filter', 'none');
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
  await page.addStyleTag({ content: `html[data-test-contrast='more'] .journal-book, html[data-test-contrast='more'] .journal-chapter { border: .15rem solid currentColor !important; }` });
  await page.evaluate(() => document.documentElement.dataset.testContrast = 'more');
  await page.getByRole('button', { name: /project archive/i }).focus();
  await expect(page.getByRole('button', { name: /project archive/i })).toBeFocused();
  expect(await page.evaluate(() => window.matchMedia('(prefers-contrast: more)').matches)).toBe(true);
  await expect(page.locator('.journal-book')).toHaveCSS('border-top-width', '2px');
  await expect(page.locator('.journal-chapter').first()).toHaveCSS('border-top-width', '2px');
});
