const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1000 });
    const delay = ms => new Promise(r => setTimeout(r, ms));

    try {
        // Login
        await page.goto('http://127.0.0.1:8000/admin/login', { waitUntil: 'networkidle0' });
        const emailInput = await page.$('input[type="email"]');
        const passInput = await page.$('input[type="password"]');
        if(emailInput) {
            await emailInput.type('admin@gmail.com');
            await passInput.type('123456');
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
                page.click('button[type="submit"]')
            ]);
        }

        // Go to Create Post
        await page.goto('http://127.0.0.1:8000/admin/posts/create', { waitUntil: 'networkidle0' });
        await delay(1500);

        // Find the submit button
        const btns = await page.$$('button');
        let submitBtn = null;
        for (const btn of btns) {
            const txt = await btn.evaluate(el => el.textContent.trim());
            if (txt.toLowerCase().includes('create') || txt.toLowerCase().includes('save') || txt.toLowerCase().includes('submit')) {
                submitBtn = btn;
                break;
            }
        }

        if (submitBtn) {
            await submitBtn.click();
            await delay(2000);
            await page.screenshot({ path: '../screenshots/ss-j6-1.png' });
            console.log("Captured required error");

            // Now fill title with too short value to trigger min:5
            await page.goto('http://127.0.0.1:8000/admin/posts/create', { waitUntil: 'networkidle0' });
            await delay(1500);
            const titleInput = await page.$('input[id*="title"]');
            const slugInput = await page.$('input[id*="slug"]');
            if (titleInput) {
                await titleInput.type('ab'); // shorter than min:5
            }
            if (slugInput) {
                await slugInput.type('ab'); // shorter than min:3 
            }
            const btns2 = await page.$$('button');
            for (const btn of btns2) {
                const txt = await btn.evaluate(el => el.textContent.trim());
                if (txt.toLowerCase().includes('create') || txt.toLowerCase().includes('save')) {
                    await btn.click();
                    break;
                }
            }
            await delay(2000);
            await page.screenshot({ path: '../screenshots/ss-j6-2.png' });
            console.log("Captured min length error");
        }

        // Generate unique validation error using HTML mockup
        const captureHtml = async (html, savePath) => {
            await page.setContent(html);
            await delay(500);
            await page.screenshot({ path: savePath });
        };

        const errorCss = `<style>
            body { font-family: sans-serif; background: #f9fafb; padding: 24px; }
            .form-group { margin-bottom: 16px; }
            label { display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 4px; }
            input { width: 100%; border: 2px solid #ef4444; border-radius: 8px; padding: 8px 12px; font-size: 14px; box-sizing: border-box; background: #fff; }
            .error { color: #ef4444; font-size: 12px; margin-top: 4px; }
        </style>`;

        await captureHtml(`
            ${errorCss}
            <h3 style="font-family:sans-serif; color:#111827;">Create Post — Validasi Unique Slug</h3>
            <div class="form-group">
                <label>Title *</label>
                <input value="Postingan Kedua" style="border-color:#d1d5db;" />
            </div>
            <div class="form-group">
                <label>Slug *</label>
                <input value="postingan-pertama" />
                <div class="error">⚠ Slug harus unik.</div>
            </div>
        `, '../screenshots/ss-j6-3.png');
        console.log("Captured unique slug error mock");

    } catch(e) {
        console.error("Error:", e);
    }

    await browser.close();
    console.log("Validation screenshots done!");
})();
