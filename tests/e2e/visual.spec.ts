import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'Stable visual baselines are maintained for Chromium; Firefox and WebKit remain functional-matrix checks.');
});

async function prepareForCapture(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addStyleTag({
    content: `*, *::before, *::after { animation: none !important; transition: none !important; }`,
  });
  await page.evaluate(() => document.fonts.ready);
}

test('captures recruiter desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/?mode=recruiter');
  await prepareForCapture(page);
  await expect(page).toHaveScreenshot('recruiter-desktop.png', { fullPage: true });
});

test('captures journal desk', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/?mode=journal');
  await prepareForCapture(page);
  await expect(page).toHaveScreenshot('journal-desk.png', { fullPage: true });
});

test('keeps the Project Archive spread 3 layout truthful without external product imagery', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/?mode=journal&chapter=project-archive&spread=3');
  await prepareForCapture(page);
  await expect(page.locator('.journal-mode')).toBeVisible();
  await expect(page.locator('.live-project-doorway:visible')).toHaveCount(0);
});

test('captures journal mobile reading flow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/?mode=journal');
  await prepareForCapture(page);
  await expect(page).toHaveScreenshot('journal-mobile.png', { fullPage: true });
});

test('captures recruiter tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/?mode=recruiter');
  await prepareForCapture(page);
  await expect(page).toHaveScreenshot('recruiter-tablet.png', { fullPage: true });
});
