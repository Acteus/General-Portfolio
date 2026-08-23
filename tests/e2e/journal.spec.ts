import { expect, test } from '@playwright/test';

test('opens a direct flagship spread URL', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=project-archive&spread=2');
  await expect(page.getByRole('heading', { name: 'Turning repositories into evidence' })).toBeVisible();
});

test('rapid chapter selection commits only the last destination', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  await page.getByRole('button', { name: /project archive/i }).click();
  await page.getByRole('button', { name: /github.*discord/i }).click();
  await expect(page.locator('[data-journal-chapter]:not([hidden])')).toHaveCount(1);
  await expect(page.locator('[data-journal-chapter="github-discord-bot"]')).toBeVisible();
  await expect(page.locator('.journal-leaf')).toHaveCount(0);
});

test('browser history restores chapter state', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  await page.getByRole('button', { name: /project archive/i }).click();
  await expect(page).toHaveURL(/chapter=project-archive/);
  await page.goBack();
  await expect(page).toHaveURL(/chapter=jobboard-devops/);
  await expect(page.locator('[data-journal-chapter="jobboard-devops"]')).toBeVisible();
});

test('Back walks through committed destinations without phantom entries', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  await page.getByRole('button', { name: /project archive/i }).click();
  await expect(page).toHaveURL(/chapter=project-archive/);
  await page.getByRole('button', { name: /github.*discord/i }).click();
  await expect(page).toHaveURL(/chapter=github-discord-bot/);
  await page.goBack();
  await expect(page).toHaveURL(/chapter=project-archive/);
  await expect(page.locator('[data-journal-chapter="project-archive"]')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/chapter=jobboard-devops/);
  await expect(page.locator('[data-journal-chapter="jobboard-devops"]')).toBeVisible();
});

test('keyboard chapter navigation focuses the destination heading', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  const archiveButton = page.getByRole('button', { name: /project archive/i });
  await archiveButton.focus();
  await archiveButton.press('Enter');
  await expect(page.locator('[data-journal-chapter="project-archive"] h2')).toBeFocused();
});

test('theme changes cancel a turning leaf and leave no transient layer', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  const historyLength = await page.evaluate(() => window.history.length);
  await page.getByRole('button', { name: /project archive/i }).click();
  await page.locator('.journal-leaf').waitFor();
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await expect(page.locator('.journal-leaf')).toHaveCount(0);
  await expect(page).toHaveURL(/chapter=jobboard-devops/);
  await expect.poll(() => page.evaluate(() => window.history.length)).toBe(historyLength);
});

test('direct spread navigation turns from the visible spread', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=project-archive&spread=3');
  await page.getByRole('button', { name: 'Next spread' }).click();
  const leaf = page.locator('.journal-leaf');
  await leaf.waitFor();
  await expect(leaf).toHaveAttribute('data-case-study-spread', '2');
});
