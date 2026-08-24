import { expect, test } from '@playwright/test';

test('opens a direct flagship spread URL', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=project-archive&spread=2');
  await expect(page.getByRole('heading', { name: 'Turning repositories into evidence' })).toBeVisible();
});

test('canonicalizes a legacy hash to its journal chapter and spread', async ({ page }) => {
  await page.goto('/#note-jobboard');
  await expect(page).toHaveURL(/\?mode=journal&chapter=jobboard-devops&spread=1$/);
  await expect(page.locator('[data-journal-chapter="jobboard-devops"]')).toBeVisible();
});

test('rapid chapter selection commits only the last destination', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  await page.locator('.journal-index a[data-journal-target="project-archive"]').click();
  await page.locator('.journal-index a[data-journal-target="github-discord-bot"]').click();
  await expect(page.locator('[data-journal-chapter]:not([hidden])')).toHaveCount(1);
  await expect(page.locator('[data-journal-chapter="github-discord-bot"]')).toBeVisible();
  await expect(page.locator('.journal-leaf')).toHaveCount(0);
});

test('superseding an in-flight turn carries the existing leaf progress', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  await page.locator('.journal-index a[data-journal-target="project-archive"]').click();
  await page.locator('.journal-leaf').waitFor();
  await page.waitForTimeout(120);
  await page.locator('.journal-index a[data-journal-target="github-discord-bot"]').click();
  await expect(page.locator('.journal-leaf[data-journal-carried-transform="true"]')).toHaveCount(1);
  await expect(page.locator('[data-journal-chapter="github-discord-bot"]')).toBeVisible();
  await expect(page.locator('.journal-leaf')).toHaveCount(0);
});

test('browser history restores chapter state', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  await page.locator('.journal-index a[data-journal-target="project-archive"]').click();
  await expect(page).toHaveURL(/chapter=project-archive/);
  await page.goBack();
  await expect(page).toHaveURL(/chapter=jobboard-devops/);
  await expect(page.locator('[data-journal-chapter="jobboard-devops"]')).toBeVisible();
});

test('parameterless Back and Forward restore the immutable journal default', async ({ page }) => {
  await page.goto('/?mode=journal');
  await expect(page.locator('[data-journal-chapter="project-archive"]')).toBeVisible();
  await expect(page.locator('[data-journal-chapter]:not([hidden])')).toHaveCount(1);
  await page.locator('.journal-index a[data-journal-target="github-discord-bot"]').click();
  await expect(page).toHaveURL(/chapter=github-discord-bot/);
  await page.goBack();
  await expect(page).toHaveURL(/\?mode=journal$/);
  await expect(page.locator('[data-journal-chapter="project-archive"]')).toBeVisible();
  await expect(page.locator('[data-journal-chapter]:not([hidden])')).toHaveCount(1);
  await page.goForward();
  await expect(page).toHaveURL(/chapter=github-discord-bot/);
  await expect(page.locator('[data-journal-chapter="github-discord-bot"]')).toBeVisible();
});

test('mobile journal keeps native sibling disclosures available', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/?mode=journal&chapter=project-archive&spread=2');
  await expect(page.locator('details[data-journal-chapter]:not([hidden])')).toHaveCount(5);
  await expect(page.locator('[data-journal-chapter="project-archive"] [data-case-study-spread]:not([hidden])')).toHaveCount(5);
  await page.locator('.journal-index a[data-journal-target="jobboard-devops"]').click();
  await expect(page.locator('details[data-journal-chapter]:not([hidden])')).toHaveCount(5);
});

test('Project Archive source captions stay bound to the audited evidence manifest', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/?mode=journal&chapter=project-archive');
  const rendered = await page.locator('[data-journal-chapter="project-archive"] [aria-label="Source paths"] code').allTextContents();
  expect(new Set(rendered)).toEqual(new Set([
    'apps/api/src/project_archive/services/chat.py',
    'apps/web/src/public/PublicApp.tsx',
    'apps/api/src/project_archive/services/indexing.py',
    'apps/api/src/project_archive/adapters/cosmos/outbox.py',
    'apps/api/src/project_archive/services/catalog.py',
    'apps/web/src/owner/OwnerApp.tsx',
    'docs/stability-operations.md',
  ]));
  await expect(page.locator('.evidence-artifact__source[data-source-claim="commit-pinned-citations"]')).toContainText('apps/web/src/public/PublicApp.tsx');
  const operations = page.locator('[data-artifact="operations"] li');
  await expect(operations).toHaveCount(5);
  await expect(operations.locator('.operations-trail__label')).toHaveText(['Queue', 'Delivery', 'Deletion', 'Recovery', 'Release']);
  await expect(operations.nth(0).locator('code')).toHaveAttribute('data-source-claim', 'durable-indexing');
  await expect(operations.nth(0).locator('code')).toHaveText('apps/api/src/project_archive/services/indexing.py');
  await expect(operations.nth(1).locator('code')).toHaveAttribute('data-source-claim', 'durable-indexing');
  await expect(operations.nth(1).locator('code')).toHaveText('apps/api/src/project_archive/adapters/cosmos/outbox.py');
  await expect(operations.nth(2).locator('code')).toHaveAttribute('data-source-claim', 'safe-deletion');
  await expect(operations.nth(2).locator('code')).toHaveText('apps/api/src/project_archive/services/catalog.py');
  await expect(operations.nth(3).locator('code')).toHaveAttribute('data-source-claim', 'owner-safe-operations');
  await expect(operations.nth(3).locator('code')).toHaveText('apps/web/src/owner/OwnerApp.tsx');
  await expect(operations.nth(4).locator('code')).toHaveAttribute('data-source-claim', 'owner-safe-operations');
  await expect(operations.nth(4).locator('code')).toHaveText('docs/stability-operations.md');
});

test('Back walks through committed destinations without phantom entries', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  await page.locator('.journal-index a[data-journal-target="project-archive"]').click();
  await expect(page).toHaveURL(/chapter=project-archive/);
  await page.locator('.journal-index a[data-journal-target="github-discord-bot"]').click();
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
  const archiveButton = page.locator('.journal-index a[data-journal-target="project-archive"]');
  await archiveButton.focus();
  await archiveButton.press('Enter');
  await expect(page.locator('[data-journal-chapter="project-archive"] h2')).toBeFocused();
});

test('theme changes cancel a turning leaf and leave no transient layer', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  const historyLength = await page.evaluate(() => window.history.length);
  await page.locator('.journal-index a[data-journal-target="project-archive"]').click();
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

test('reverse spread navigation derives the reverse turn direction', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=project-archive&spread=3');
  await page.getByRole('button', { name: 'Previous spread' }).click();
  await expect.poll(() => page.locator('.journal-leaf').evaluate((leaf) => (leaf as HTMLElement).style.transformOrigin)).toMatch(/right center/);
});
