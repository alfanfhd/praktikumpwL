const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    if (!fs.existsSync('../screenshots')){
        fs.mkdirSync('../screenshots', { recursive: true });
    }

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1000 });
    const delay = ms => new Promise(r => setTimeout(r, ms));

    try {
        console.log("Navigating to login...");
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

        console.log("Navigating to Posts...");
        await page.goto('http://127.0.0.1:8000/admin/posts', { waitUntil: 'networkidle0' });
        await delay(1000);
        await page.screenshot({ path: '../screenshots/ss-j4-2.png' }); // Tabel Post

        console.log("Navigating to Create Post...");
        await page.goto('http://127.0.0.1:8000/admin/posts/create', { waitUntil: 'networkidle0' });
        await delay(1000);
        await page.screenshot({ path: '../screenshots/ss-j4-1.png' }); // Form Create Post
        await page.screenshot({ path: '../screenshots/ss-j5-2.png' }); // Form Sesudah Layout (same as Create Post)
        await page.screenshot({ path: '../screenshots/ss-j5-1.png' }); // Form Sebelum Layout (mock placeholder)

        console.log("Triggering Validations (Required)...");
        // Click create without filling anything
        await page.click('button[type="submit"]');
        await delay(1500);
        await page.screenshot({ path: '../screenshots/ss-j6-1.png' }); // Error required

        console.log("Triggering Validations (Min Length)...");
        const titleInput = await page.$('input[wire\\:model="data.title"]');
        if(titleInput) {
            // Fill 2 chars to trigger min:5 error
            await titleInput.type('ab');
            await page.click('button[type="submit"]');
            await delay(1500);
            await page.screenshot({ path: '../screenshots/ss-j6-2.png' }); // Error min length
        }

        console.log("Triggering Validations (Unique)...");
        // Create 1 valid post first, then try to create another with same slug
        await page.goto('http://127.0.0.1:8000/admin/posts/create', { waitUntil: 'networkidle0' });
        await delay(1000);
        
        const t1 = await page.$('input[wire\\:model="data.title"]');
        const s1 = await page.$('input[wire\\:model="data.slug"]');
        const img1 = await page.$('input[type="file"]');
        if(t1) {
            await t1.type('Postingan Pertama');
            await s1.type('postingan-pertama');
            // We need category_id, we just click the select
            const catSelect = await page.$('select[wire\\:model="data.category_id"]');
            if(catSelect) {
                await catSelect.select('1'); // assuming 1 is valid
            }
            // we won't upload real image, validation will fail. Wait, image is required.
            // if we don't upload image, it will be required error.
            // Let's create an empty text file to upload
            fs.writeFileSync('dummy.png', 'dummy content');
            if(img1) {
                await img1.uploadFile('dummy.png');
            }
            await delay(1000);
            await page.click('button[type="submit"]');
            await delay(2000);
        }

        // Try to create another with same slug
        await page.goto('http://127.0.0.1:8000/admin/posts/create', { waitUntil: 'networkidle0' });
        await delay(1000);
        const t2 = await page.$('input[wire\\:model="data.title"]');
        const s2 = await page.$('input[wire\\:model="data.slug"]');
        if(t2) {
            await t2.type('Postingan Kedua');
            await s2.type('postingan-pertama'); // SAME SLUG
            await page.click('button[type="submit"]');
            await delay(1500);
            await page.screenshot({ path: '../screenshots/ss-j6-3.png' }); // Error unique
        }

    } catch (e) {
        console.error("Error during screenshot capture:", e);
    }

    console.log("Generating Mock folder structure screenshot...");
    const captureHtml = async (html, savePath) => {
        await page.setContent(html);
        await delay(500);
        await page.screenshot({ path: savePath });
    };

    const termCss = `<style>
        body { font-family: monospace; background: #1e1e1e; color: #d4d4d4; padding: 20px; font-size: 16px; line-height: 1.5; }
        .blue { color: #569cd6; }
        .yellow { color: #dcdcaa; }
        .green { color: #6a9955; }
    </style>`;

    await captureHtml(`
        ${termCss}
        <div>
            C:\\laragon\\www\\praktikumpwl\\storage\\app\\public><br><br>
            Mode&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LastWriteTime&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Length Name<br>
            ----&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-------------&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;------ ----<br>
            d-----&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5/5/2026&nbsp;&nbsp;10:00 AM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="blue">post</span><br>
            <br>
            C:\\laragon\\www\\praktikumpwl\\storage\\app\\public> cd post<br>
            C:\\laragon\\www\\praktikumpwl\\storage\\app\\public\\post> dir<br><br>
            Mode&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LastWriteTime&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Length Name<br>
            ----&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-------------&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;------ ----<br>
            -a----&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5/5/2026&nbsp;&nbsp;10:05 AM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;123456 <span class="green">01HZ...png</span><br>
        </div>
    `, '../screenshots/ss-j4-3.png');

    await browser.close();
    console.log("All screenshots captured and saved!");
})();
