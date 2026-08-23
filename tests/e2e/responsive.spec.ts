import { expect, test } from '@playwright/test';

for (const width of [375, 768, 1024, 1440]) {
  test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/?mode=journal');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('keeps the page within a zoom-equivalent narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/?mode=journal');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('uses native chapter disclosures on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/?mode=journal');
  await expect(page.locator('details[data-journal-chapter]').first()).toBeVisible();
  await expect(page.locator('.journal-turn-layer')).toBeHidden();
});

test('keeps no-JavaScript recruiter dark and journal warm', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('/?mode=recruiter');
  await expect(page.locator('.recruiter-mode')).toBeVisible();
  await expect(page.locator('.journal-mode')).toBeVisible();
  await expect(page.locator('.recruiter-mode')).toHaveCSS('background-color', 'rgb(21, 25, 26)');
  await expect(page.locator('.journal-mode')).toHaveCSS('background-color', 'rgb(245, 238, 223)');
  await context.close();
});
