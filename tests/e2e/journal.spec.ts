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
  await page.goBack();
  await expect(page.locator('[data-journal-chapter="jobboard-devops"]')).toBeVisible();
});
