import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const mode of ['recruiter', 'journal']) {
  test(`${mode} has no serious or critical axe violations`, async ({ page }) => {
    await page.goto(`/?mode=${mode}`);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  });
}

test('keyboard focus survives a theme switch and journal navigation', async ({ page }) => {
  await page.goto('/?mode=recruiter');
  const toggle = page.getByRole('button', { name: /switch to journal/i });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /switch to recruiter/i })).toBeFocused();

  const archiveButton = page.getByRole('button', { name: /project archive/i });
  await page.getByRole('button', { name: /jobboard-devops/i }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-journal-chapter="jobboard-devops"] h2')).toBeFocused();
  await archiveButton.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-journal-chapter="project-archive"] h2')).toBeFocused();
});

test('skip link is the first keyboard destination', async ({ page }) => {
  await page.goto('/?mode=recruiter');
  const firstFocusable = await page.evaluate(() => {
    const candidates = [...document.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')];
    return candidates.find((candidate) => {
      const style = getComputedStyle(candidate);
      return !candidate.hasAttribute('disabled') && style.display !== 'none' && style.visibility !== 'hidden';
    })?.className;
  });
  expect(firstFocusable).toBe('skip-link');
  await page.getByRole('link', { name: 'Skip to content' }).focus();
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
});

test('turning leaves are hidden from the accessibility tree', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  await page.getByRole('button', { name: /project archive/i }).click();
  const leaf = page.locator('.journal-leaf');
  await leaf.waitFor();
  await expect(leaf).toHaveAttribute('aria-hidden', 'true');
  await expect(leaf).toHaveAttribute('inert', '');
});
