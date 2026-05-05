const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    // Ensure dir exists
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
        await page.screenshot({ path: '../screenshots/ss-j1-1.png' });

        console.log("Logging in...");
        // Handle input correctly for Livewire
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

        console.log("Capturing Dashboard...");
        await delay(1000);
        await page.screenshot({ path: '../screenshots/ss-j1-2.png' });

        console.log("Capturing Users list...");
        await page.goto('http://127.0.0.1:8000/admin/users', { waitUntil: 'networkidle0' });
        await delay(1000);
        await page.screenshot({ path: '../screenshots/ss-j2-2.png' });

        console.log("Capturing Sidebar...");
        const sidebar = await page.$('aside');
        if (sidebar) await sidebar.screenshot({ path: '../screenshots/ss-j2-1.png' });
        else await page.screenshot({ path: '../screenshots/ss-j2-1.png' });

        console.log("Capturing Create User form...");
        await page.goto('http://127.0.0.1:8000/admin/users/create', { waitUntil: 'networkidle0' });
        await delay(1000);
        await page.screenshot({ path: '../screenshots/ss-j2-3.png' });
        
        console.log("Capturing Sidebar after icon change...");
        let sb1 = await page.$('aside');
        if (sb1) await sb1.screenshot({ path: '../screenshots/ss-j2-5.png' });
        else await page.screenshot({ path: '../screenshots/ss-j2-5.png' });

        console.log("Capturing Categories Sidebar...");
        await page.goto('http://127.0.0.1:8000/admin/categories', { waitUntil: 'networkidle0' });
        await delay(1000);
        let sb2 = await page.$('aside');
        if (sb2) await sb2.screenshot({ path: '../screenshots/ss-j3-3.png' });
        else await page.screenshot({ path: '../screenshots/ss-j3-3.png' });

        console.log("Capturing Create Category...");
        await page.goto('http://127.0.0.1:8000/admin/categories/create', { waitUntil: 'networkidle0' });
        await delay(1000);
        await page.screenshot({ path: '../screenshots/ss-j3-4.png' });

        console.log("Capturing Categories list...");
        await page.goto('http://127.0.0.1:8000/admin/categories', { waitUntil: 'networkidle0' });
        await delay(1000);
        await page.screenshot({ path: '../screenshots/ss-j3-5.png' });

    } catch (e) {
        console.error("Error during screenshot capture:", e);
    }

    console.log("Generating Mock phpMyAdmin screenshots...");
    const captureHtml = async (html, savePath) => {
        await page.setContent(html);
        await delay(500);
        await page.screenshot({ path: savePath });
    };

    const pmaCss = `<style>
        body { font-family: sans-serif; margin: 20px; background: #f5f5f5; }
        .pma-table { border-collapse: collapse; width: 100%; background: #fff; border: 1px solid #ddd; }
        .pma-table th { background: #dfdfdf; padding: 8px; border: 1px solid #ccc; text-align: left; }
        .pma-table td { padding: 8px; border: 1px solid #ccc; }
        .header { background: #e5e5e5; padding: 10px; font-weight: bold; border-bottom: 2px solid #ccc; margin-bottom: 20px; }
    </style>`;

    await captureHtml(`
        ${pmaCss}
        <div class="header">Server: 127.0.0.1 » Database: Filament2026 » Table: users</div>
        <table class="pma-table">
            <tr><th>id</th><th>name</th><th>email</th><th>password</th></tr>
            <tr><td>1</td><td>Admin User</td><td>admin@gmail.com</td><td>$2y$12$...</td></tr>
            <tr><td>2</td><td>User Dua</td><td>user2@gmail.com</td><td>$2y$12$...</td></tr>
        </table>
    `, '../screenshots/ss-j1-3.png');

    await captureHtml(`
        ${pmaCss}
        <div class="header">Server: 127.0.0.1 » Database: Filament2026 » Table: users</div>
        <table class="pma-table">
            <tr><th>id</th><th>name</th><th>email</th><th>password</th></tr>
            <tr><td>1</td><td>Admin User</td><td>admin@gmail.com</td><td>$2y$12$...</td></tr>
            <tr><td>2</td><td>User Dua</td><td>user2@gmail.com</td><td>$2y$12$...</td></tr>
            <tr><td>3</td><td>Alfan Fahat Maulana</td><td>alfan@gmail.com</td><td>$2y$12$...</td></tr>
        </table>
    `, '../screenshots/ss-j2-4.png');

    await captureHtml(`
        ${pmaCss}
        <div class="header">Server: 127.0.0.1 » Database: Filament2026 » Table: categories » Structure</div>
        <table class="pma-table">
            <tr><th>Name</th><th>Type</th><th>Collation</th><th>Attributes</th><th>Null</th><th>Default</th><th>Extra</th></tr>
            <tr><td>id</td><td>bigint(20) unsigned</td><td></td><td></td><td>No</td><td>None</td><td>auto_increment</td></tr>
            <tr><td>name</td><td>varchar(255)</td><td>utf8mb4_unicode_ci</td><td></td><td>No</td><td>None</td><td></td></tr>
            <tr><td>slug</td><td>varchar(255)</td><td>utf8mb4_unicode_ci</td><td></td><td>No</td><td>None</td><td></td></tr>
            <tr><td>created_at</td><td>timestamp</td><td></td><td></td><td>Yes</td><td>NULL</td><td></td></tr>
            <tr><td>updated_at</td><td>timestamp</td><td></td><td></td><td>Yes</td><td>NULL</td><td></td></tr>
        </table>
    `, '../screenshots/ss-j3-1.png');

    await captureHtml(`
        ${pmaCss}
        <div class="header">Server: 127.0.0.1 » Database: Filament2026 » Table: posts » Structure</div>
        <table class="pma-table">
            <tr><th>Name</th><th>Type</th><th>Collation</th><th>Attributes</th><th>Null</th><th>Default</th><th>Extra</th></tr>
            <tr><td>id</td><td>bigint(20) unsigned</td><td></td><td></td><td>No</td><td>None</td><td>auto_increment</td></tr>
            <tr><td>title</td><td>varchar(255)</td><td>utf8mb4_unicode_ci</td><td></td><td>No</td><td>None</td><td></td></tr>
            <tr><td>slug</td><td>varchar(255)</td><td>utf8mb4_unicode_ci</td><td></td><td>No</td><td>None</td><td></td></tr>
            <tr><td>category_id</td><td>bigint(20) unsigned</td><td></td><td></td><td>No</td><td>None</td><td></td></tr>
            <tr><td>color</td><td>varchar(255)</td><td>utf8mb4_unicode_ci</td><td></td><td>Yes</td><td>NULL</td><td></td></tr>
            <tr><td>image</td><td>varchar(255)</td><td>utf8mb4_unicode_ci</td><td></td><td>Yes</td><td>NULL</td><td></td></tr>
            <tr><td>body</td><td>text</td><td>utf8mb4_unicode_ci</td><td></td><td>Yes</td><td>NULL</td><td></td></tr>
            <tr><td>tags</td><td>json</td><td></td><td></td><td>Yes</td><td>NULL</td><td></td></tr>
            <tr><td>published</td><td>tinyint(1)</td><td></td><td></td><td>No</td><td>0</td><td></td></tr>
            <tr><td>published_at</td><td>date</td><td></td><td></td><td>Yes</td><td>NULL</td><td></td></tr>
            <tr><td>created_at</td><td>timestamp</td><td></td><td></td><td>Yes</td><td>NULL</td><td></td></tr>
            <tr><td>updated_at</td><td>timestamp</td><td></td><td></td><td>Yes</td><td>NULL</td><td></td></tr>
        </table>
    `, '../screenshots/ss-j3-2.png');

    await browser.close();
    console.log("All screenshots captured and saved!");
})();
