const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

(async () => {
    const browser = await chromium.launch();
    try {
        const errors = [];
        const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
        page.on('pageerror', error => errors.push(error.message));
        // Exercise the real site with unavailable third-party scripts/fonts.
        await page.route('https://**/*', route => route.abort());
        await page.addInitScript(() => localStorage.setItem('portfolio-theme', 'light'));
        const url = pathToFileURL(path.resolve('index.html')).href;
        await page.goto(url);
        await page.waitForTimeout(150);
        assert.equal(await page.locator('.journal-pager:visible').count(), 1, 'one active project pager');
        const dimensions = [];
        const ids = ['note-laborwise', 'note-jobboard', 'note-jru-atlas', 'note-project-archive', 'note-discord-bot'];
        for (const id of ids) {
            await page.locator(`#${id} > summary`).click();
            await page.waitForTimeout(650);
            for (let spread = 0; spread < 2; spread++) {
                if (spread) {
                    await page.locator(`#${id} [data-journal-next]`).click();
                    await page.waitForTimeout(650);
                }
                const metrics = await page.locator(`#${id} .project-entry__spread:visible`).evaluate(el => ({
                    width: el.getBoundingClientRect().width,
                    height: el.getBoundingClientRect().height,
                    workspaceHeight: el.closest('.project-notebook__workspace').getBoundingClientRect().height,
                    clipped: [...el.querySelectorAll('.project-page')].some(p => p.scrollHeight > p.clientHeight + 2),
                }));
                assert.equal(metrics.clipped, false, `${id} spread ${spread + 1} must fit`);
                dimensions.push(metrics);
            }
        }
        for (const value of dimensions) {
            assert.ok(Math.abs(value.height - dimensions[0].height) < 1, 'stable book height');
            assert.ok(Math.abs(value.width - dimensions[0].width) < 1, 'stable book width');
            assert.ok(Math.abs(value.workspaceHeight - dimensions[0].workspaceHeight) < 1, 'stable desk height');
        }
        assert.equal(await page.locator('#note-discord-bot [data-journal-next]').isDisabled(), true);
        assert.equal(await page.locator('#note-discord-bot [data-journal-prev]').isDisabled(), false);
        // Keyboard activation preserves focus on a usable control at both bounds.
        await page.locator('#note-discord-bot [data-journal-prev]').focus();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(650);
        assert.equal(await page.evaluate(() => document.activeElement.disabled), false);
        assert.match(await page.locator('#note-discord-bot [data-journal-position]').textContent(), /1.*2/);
        // Rapid changes resolve to the final request.
        await page.evaluate(() => {
            document.querySelector('#note-project-archive > summary').click();
            document.querySelector('#note-jru-atlas > summary').click();
            document.querySelector('#note-discord-bot > summary').click();
        });
        await page.waitForTimeout(650);
        assert.equal(await page.locator('.project-entry[open]').getAttribute('id'), 'note-discord-bot');
        assert.equal(await page.locator('.project-journal__leaf').count(), 0);
        // Deep links and subsequent hash navigation.
        await page.goto(`${url}#note-private-work`);
        assert.equal(await page.locator('.project-entry[open]').getAttribute('id'), 'note-jru-atlas');
        await page.evaluate(() => { location.hash = 'note-project-archive'; });
        await page.waitForTimeout(50);
        assert.equal(await page.locator('.project-entry[open]').getAttribute('id'), 'note-project-archive');
        await page.locator('.project-notebook__workspace').screenshot({ path: '/private/tmp/journal-after-desktop.png' });
        for (const width of [1280, 1024, 768, 375, 320]) {
            await page.setViewportSize({ width, height: 900 });
            await page.waitForTimeout(100);
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
            assert.equal(overflow, false, `no horizontal overflow at ${width}`);
            if (width < 1200) {
                assert.equal(await page.locator('#note-project-archive .project-entry__spread:visible').count(), 2, 'flowing layout exposes both spreads');
                assert.equal(await page.locator('.journal-pager:visible').count(), 0);
            } else {
                const clipped = await page.locator('.project-entry[open] .project-page:visible').evaluateAll(pages => pages.some(p => p.scrollHeight > p.clientHeight + 2));
                assert.equal(clipped, false, 'small laptop pages fit');
                for (const id of ids) {
                    await page.locator(`#${id} > summary`).click();
                    await page.waitForTimeout(550);
                    for (let spread = 0; spread < 2; spread++) {
                        if (spread) { await page.locator(`#${id} [data-journal-next]`).click(); await page.waitForTimeout(550); }
                        const fits = await page.locator(`#${id} .project-entry__spread:visible .project-page`).evaluateAll(pages => pages.every(p => p.scrollHeight <= p.clientHeight + 2));
                        assert.equal(fits, true, `${id} spread ${spread + 1} fits at ${width}`);
                    }
                }
                await page.locator('.project-notebook__workspace').screenshot({ path: '/private/tmp/journal-after-laptop.png' });
                await page.locator('#note-project-archive > summary').click();
                await page.waitForTimeout(550);
            }
        }
        await page.locator('#projects').screenshot({ path: '/private/tmp/journal-after-mobile.png' });
        // Enlarged text switches to flowing reading, rather than clipping.
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.evaluate(() => document.documentElement.style.fontSize = '32px');
        await page.waitForTimeout(100);
        assert.equal(await page.locator('#note-project-archive .project-entry__spread:visible').count(), 2);
        await page.evaluate(() => document.documentElement.style.fontSize = '');
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.locator('#note-jru-atlas > summary').click();
        await page.waitForTimeout(50);
        assert.equal(await page.locator('.project-entry[open]').getAttribute('id'), 'note-jru-atlas');
        assert.equal(await page.locator('.project-journal__leaf').count(), 0);
        await page.locator('#theme-toggle').click();
        assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
        assert.equal(await page.locator('[data-content-theme="dark"]').first().isVisible(), true);
        await page.screenshot({ path: '/private/tmp/journal-after-dark.png' });
        const resumeLinks = await page.locator('a[href$=".pdf"]').evaluateAll(links => links.map(a => a.getAttribute('href')));
        assert.equal(resumeLinks.length, 4);
        assert.ok(resumeLinks.every(href => href === 'output/pdf/Garren-Dullas-Intern-Resume.pdf'));
        assert.equal(await page.locator('#current-work-grid h3').first().textContent(), 'LaborWise');
        await page.goto(new URL('case-studies/laborwise.html', url).href);
        assert.equal(await page.locator('h1').textContent(), 'LaborWise');
        assert.equal(await page.locator('svg[role="img"]').count(), 1);
        for (const width of [1440,375,320]) {
            await page.setViewportSize({width,height:900});
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'case study reflows');
        }
        assert.deepEqual(errors, [], 'no runtime errors with third-party resources unavailable');
        const fallback = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
        await fallback.route('https://**/*', route => route.abort());
        // Emulate server-delivered light content without running enhancement scripts.
        await fallback.route('**/index.html', async route => {
            const fs = require('node:fs');
            const html = fs.readFileSync('index.html', 'utf8').replace('data-theme="dark"', 'data-theme="light"').replaceAll('data-content-theme="light" hidden', 'data-content-theme="light"').replaceAll('data-content-theme="dark"', 'data-content-theme="dark" hidden');
            await route.fulfill({ contentType: 'text/html', body: html });
        });
        await fallback.goto(url);
        assert.equal(await fallback.locator('#note-laborwise .project-entry__spread:visible').count(), 2, 'all spreads readable without JavaScript');
        console.log('PASS: stable geometry, pagination, keyboard, rapid selection, deep links, responsive flow, enlarged text, reduced motion, dark mode, offline and no-JavaScript fallback.');
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
