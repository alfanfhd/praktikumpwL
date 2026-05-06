const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    if (!fs.existsSync('../screenshots')){
        fs.mkdirSync('../screenshots', { recursive: true });
    }

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    const delay = ms => new Promise(r => setTimeout(r, ms));

    try {
        console.log("Navigating to login...");
        await page.goto('http://127.0.0.1:8000/admin/login', { waitUntil: 'networkidle0' });

        console.log("Logging in...");
        await page.type('input[type="email"]', 'admin@gmail.com');
        await page.type('input[type="password"]', '123456');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);

        // ---- JOBSHEET 13 & 14 ----
        console.log("Navigating to Posts List...");
        await page.goto('http://127.0.0.1:8000/admin/posts', { waitUntil: 'networkidle0' });
        await delay(2000);
        
        // SS: Table with Category column and Actions (Delete, Replicate, Status)
        await page.screenshot({ path: '../screenshots/ss-j1314-table.png' });

        // SS: Custom Status Action Modal
        const statusBtns = await page.$$('button[title="Status Change"], button[aria-label="Status Change"]');
        if(statusBtns.length > 0) {
            await statusBtns[0].click();
            await delay(1000);
            await page.screenshot({ path: '../screenshots/ss-j13-status-modal.png' });
            await page.keyboard.press('Escape');
            await delay(500);
        }

        // SS: Post Form with Category Dropdown (Searchable) and Multi-select Tags
        console.log("Navigating to Create Post...");
        await page.goto('http://127.0.0.1:8000/admin/posts/create', { waitUntil: 'networkidle0' });
        await delay(1500);
        await page.screenshot({ path: '../screenshots/ss-j1415-form.png' });

        // ---- JOBSHEET 14 ----
        console.log("Navigating to Categories List...");
        await page.goto('http://127.0.0.1:8000/admin/categories', { waitUntil: 'networkidle0' });
        await delay(1500);
        const editCatLinks = await page.$$('a[href*="/edit"]');
        if(editCatLinks.length > 0) {
            await editCatLinks[0].click();
            await delay(2000);
            // SS: Relationship Manager in Category Edit page
            await page.screenshot({ path: '../screenshots/ss-j14-rel-manager.png' });
        }

        // ---- JOBSHEET 15 ----
        console.log("Navigating to Tags List...");
        await page.goto('http://127.0.0.1:8000/admin/tags', { waitUntil: 'networkidle0' });
        await delay(1500);
        await page.screenshot({ path: '../screenshots/ss-j15-tags-table.png' });

        // SS: Tags Relationship Manager in Post Edit page
        console.log("Navigating to Post Edit for Tags Rel Manager...");
        await page.goto('http://127.0.0.1:8000/admin/posts', { waitUntil: 'networkidle0' });
        await delay(1500);
        const editPostLinks = await page.$$('a[href*="/edit"]');
        if(editPostLinks.length > 0) {
            await editPostLinks[0].click();
            await delay(2000);
            await page.screenshot({ path: '../screenshots/ss-j15-rel-manager.png' });
        }

    } catch (e) {
        console.error("Error during screenshot capture:", e);
    }

    await browser.close();
    console.log("All screenshots captured!");
})();
