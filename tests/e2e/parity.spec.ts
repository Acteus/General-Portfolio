import { expect, test } from '@playwright/test';

test('renders recruiter and journal modes from the same projects', async ({ page }) => {
  await page.goto('/?mode=recruiter');
  await expect(page.getByRole('heading', { name: 'JobBoard-DevOps' })).toBeVisible();
  await page.getByRole('button', { name: /switch to journal/i }).click();
  await expect(page.getByRole('heading', { name: /field journal/i })).toBeVisible();
  await expect(page.getByText('JobBoard-DevOps', { exact: true }).first()).toBeVisible();
});

test('keeps inactive project links truthful', async ({ page }) => {
  await page.goto('/?mode=recruiter');
  await expect(page.getByText('Link pending', { exact: true }).first()).toBeVisible();
  await expect(page.locator('a[href=""], a[href="#"]')).toHaveCount(0);
});

test('renders the complete collection and collection-driven journal set', async ({ page }) => {
  await page.goto('/?mode=recruiter');
  await expect(page.locator('.recruiter-project')).toHaveCount(13);
  await page.goto('/?mode=journal');
  await expect(page.locator('details[data-journal-chapter]')).toHaveCount(5);
});
