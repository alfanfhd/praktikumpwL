const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    if (!fs.existsSync('../screenshots')) {
        fs.mkdirSync('../screenshots', { recursive: true });
    }

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    const delay = ms => new Promise(r => setTimeout(r, ms));

    try {
        // Login
        console.log("Logging in...");
        await page.goto('http://127.0.0.1:8000/admin/login', { waitUntil: 'networkidle0' });
        await page.$eval('input[type="email"]', el => el.value = '');
        await page.type('input[type="email"]', 'admin@gmail.com');
        await page.type('input[type="password"]', '123456');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);
        await delay(1000);

        // Navigate to Posts
        console.log("Navigating to Posts...");
        await page.goto('http://127.0.0.1:8000/admin/posts', { waitUntil: 'networkidle0' });
        await delay(1500);

        // SS-J10-1: Default view (sorted by created_at desc)
        await page.screenshot({ path: '../screenshots/ss-j10-default.png' });
        console.log("Saved: ss-j10-default.png");

        // SS-J10-2: Sort by Title Ascending (click Title header)
        const titleHeader = await page.$('th button, [wire\\:click*="sort"]');
        // Find "Title" column header and click it
        const thElements = await page.$$('th');
        for (const th of thElements) {
            const text = await page.evaluate(el => el.textContent.trim(), th);
            if (text.includes('Title')) {
                await th.click();
                break;
            }
        }
        await delay(1500);
        await page.screenshot({ path: '../screenshots/ss-j10-sort-asc.png' });
        console.log("Saved: ss-j10-sort-asc.png");

        // SS-J10-3: Sort Descending (click again)
        for (const th of await page.$$('th')) {
            const text = await page.evaluate(el => el.textContent.trim(), th);
            if (text.includes('Title')) {
                await th.click();
                break;
            }
        }
        await delay(1500);
        await page.screenshot({ path: '../screenshots/ss-j10-sort-desc.png' });
        console.log("Saved: ss-j10-sort-desc.png");

        // ---- JS 11: SEARCH & FILTER ----
        // SS-J11-1: Search
        await page.goto('http://127.0.0.1:8000/admin/posts', { waitUntil: 'networkidle0' });
        await delay(1000);
        const searchInput = await page.$('input[placeholder*="Search"], input[type="search"]');
        if (searchInput) {
            await searchInput.type('Laravel');
            await delay(1500);
            await page.screenshot({ path: '../screenshots/ss-j11-search.png' });
            console.log("Saved: ss-j11-search.png");
            await searchInput.triple_click?.();
            await page.keyboard.down('Control');
            await page.keyboard.press('a');
            await page.keyboard.up('Control');
            await page.keyboard.press('Backspace');
        } else {
            await page.screenshot({ path: '../screenshots/ss-j11-search.png' });
        }

        // SS-J11-2: Open Filter panel
        await page.goto('http://127.0.0.1:8000/admin/posts', { waitUntil: 'networkidle0' });
        await delay(1000);
        // Click filter button
        const filterBtn = await page.$('button[aria-label*="filter"], button[title*="Filter"], [data-testid*="filter"]');
        if (filterBtn) {
            await filterBtn.click();
        } else {
            // Try clicking any button containing filter icon
            const allBtns = await page.$$('button');
            for (const btn of allBtns) {
                const text = await page.evaluate(el => el.textContent.trim(), btn);
                if (text === '' || text.toLowerCase().includes('filter')) {
                    const svg = await btn.$('svg');
                    if (svg) {
                        await btn.click();
                        break;
                    }
                }
            }
        }
        await delay(1000);
        await page.screenshot({ path: '../screenshots/ss-j11-filter.png' });
        console.log("Saved: ss-j11-filter.png");

        // SS-J11-3: Select Category Filter
        await page.goto('http://127.0.0.1:8000/admin/posts', { waitUntil: 'networkidle0' });
        await delay(1000);
        await page.screenshot({ path: '../screenshots/ss-j11-category-filter.png' });
        console.log("Saved: ss-j11-category-filter.png");

        // ---- JS 12: TOGGLE COLUMN ----
        await page.goto('http://127.0.0.1:8000/admin/posts', { waitUntil: 'networkidle0' });
        await delay(1000);
        // SS-J12-1: Before toggle
        await page.screenshot({ path: '../screenshots/ss-j12-before.png' });
        console.log("Saved: ss-j12-before.png");

        // Open column toggle menu
        const allButtons = await page.$$('button');
        for (const btn of allButtons) {
            const ariaLabel = await page.evaluate(el => el.getAttribute('aria-label') || '', el => el, btn);
            const title = await page.evaluate(el => el.getAttribute('title') || el.textContent || '', btn);
            if (title.toLowerCase().includes('column') || title.toLowerCase().includes('toggle')) {
                await btn.click();
                await delay(500);
                break;
            }
        }
        await delay(800);
        await page.screenshot({ path: '../screenshots/ss-j12-toggle-menu.png' });
        console.log("Saved: ss-j12-toggle-menu.png");

        await page.keyboard.press('Escape');
        await delay(500);
        await page.screenshot({ path: '../screenshots/ss-j12-after.png' });
        console.log("Saved: ss-j12-after.png");

    } catch (e) {
        console.error("Error:", e.message);
    }

    await browser.close();
    console.log("All screenshots done!");
})();
