const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    if (!fs.existsSync('../screenshots')){
        fs.mkdirSync('../screenshots', { recursive: true });
    }

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const delay = ms => new Promise(r => setTimeout(r, ms));

    try {
        console.log("Navigating to login...");
        await page.goto('http://127.0.0.1:8000/admin/login', { waitUntil: 'networkidle0' });

        console.log("Logging in...");
        const emailInput = await page.$('input[type="email"]');
        const passInput = await page.$('input[type="password"]');
        if(emailInput) {
            await emailInput.type('admin@gmail.com');
            await passInput.type('123456');
        }
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);

        console.log("Navigating to Products...");
        await page.goto('http://127.0.0.1:8000/admin/products', { waitUntil: 'networkidle0' });
        await delay(1000);
        await page.screenshot({ path: '../screenshots/ss-j7-table.png' });

        console.log("Navigating to Create Product...");
        await page.goto('http://127.0.0.1:8000/admin/products/create', { waitUntil: 'networkidle0' });
        await delay(1000);
        await page.screenshot({ path: '../screenshots/ss-j7-step1.png' });

        // Go to Step 2
        console.log("Navigating to Step 2...");
        const stepButtons = await page.$$('button[role="tab"]');
        if(stepButtons.length > 1) {
            await stepButtons[1].click();
            await delay(1000);
            await page.screenshot({ path: '../screenshots/ss-j7-step2.png' });
        }

        // Go to Step 3
        console.log("Navigating to Step 3...");
        if(stepButtons.length > 2) {
            await stepButtons[2].click();
            await delay(1000);
            await page.screenshot({ path: '../screenshots/ss-j7-step3.png' });
        }

        console.log("Navigating to View Product...");
        // Get the first product ID to view
        await page.goto('http://127.0.0.1:8000/admin/products', { waitUntil: 'networkidle0' });
        await delay(1000);
        const viewLinks = await page.$$('a[href*="/admin/products/"]');
        let viewUrl = null;
        for(const link of viewLinks) {
             const href = await page.evaluate(el => el.href, link);
             if(href && href.endsWith('view')) {
                  viewUrl = href;
                  break;
             }
        }
        
        if (!viewUrl && viewLinks.length > 0) {
             const href = await page.evaluate(el => el.href, viewLinks[0]);
             if(href) viewUrl = href.replace('/edit', '/view');
        }

        if(viewUrl) {
             await page.goto(viewUrl, { waitUntil: 'networkidle0' });
             await delay(1000);
             await page.screenshot({ path: '../screenshots/ss-j9-tab1.png' });

             // Tab 2
             const tabs = await page.$$('button[role="tab"]');
             if(tabs.length > 1) {
                 await tabs[1].click();
                 await delay(1000);
                 await page.screenshot({ path: '../screenshots/ss-j9-tab2.png' });
             }

             // Tab 3
             if(tabs.length > 2) {
                 await tabs[2].click();
                 await delay(1000);
                 await page.screenshot({ path: '../screenshots/ss-j9-tab3.png' });
             }
        }

    } catch (e) {
        console.error("Error during screenshot capture:", e);
    }

    await browser.close();
    console.log("All screenshots captured and saved!");
})();
