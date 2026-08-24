import { expect, test } from '@playwright/test';

test('renders recruiter and journal modes from the same projects', async ({ page }) => {
  await page.goto('/?mode=recruiter');
  await expect(page.getByRole('heading', { name: 'JobBoard-DevOps' })).toBeVisible();
  await page.getByRole('button', { name: /switch to journal/i }).click();
  await expect(page.getByRole('heading', { name: /field journal/i })).toBeVisible();
  await page.locator('.journal-index a[data-journal-target="jobboard-devops"]').click();
  await expect(page.locator('[data-journal-chapter="jobboard-devops"] h2')).toBeVisible();
});

test('keeps inactive project links truthful', async ({ page }) => {
  await page.goto('/?mode=recruiter');
  await expect(page.getByText('Link pending', { exact: true }).first()).toBeVisible();
  await expect(page.locator('a[href=""], a[href="#"]')).toHaveCount(0);
});

test('switches the brand and navigation to mode-specific journal targets', async ({ page }) => {
  await page.goto('/?mode=recruiter');
  await expect(page.locator('.brand')).toHaveAttribute('href', '#home');
  await expect(page.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
  await page.getByRole('button', { name: /switch to journal/i }).click();
  await expect(page.locator('.brand')).toHaveAttribute('href', '#home-journal');
  await expect(page.getByRole('link', { name: 'Story' })).toHaveAttribute('href', '#journal-story');
  await expect(page.getByRole('link', { name: 'Notes', exact: true })).toHaveAttribute('href', '#journal-projects');
  await page.goBack();
  await expect(page.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
});

test('links every both-mode recruiter project to its exact journal chapter', async ({ page }) => {
  await page.goto('/?mode=recruiter');
  const links = page.locator('.recruiter-project a[href^="/?mode=journal&chapter="]');
  await expect(links).toHaveCount(5);
  await expect(page.locator('#recruiter-transport-ph .recruiter-project__role')).toHaveCount(0);
  await expect(page.getByText(/not specified in legacy page/i)).toHaveCount(0);
});

test('renders the complete collection and collection-driven journal set', async ({ page }) => {
  await page.goto('/?mode=recruiter');
  await expect(page.locator('.recruiter-project')).toHaveCount(13);
  await page.goto('/?mode=journal');
  await expect(page.locator('details[data-journal-chapter]')).toHaveCount(5);
});
