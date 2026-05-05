const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 600 });
    const delay = ms => new Promise(r => setTimeout(r, ms));

    const captureHtml = async (html, savePath) => {
        await page.setContent(html);
        await delay(300);
        await page.screenshot({ path: savePath });
        console.log("Saved:", savePath);
    };

    const css = `<style>
        body { font-family: 'Segoe UI', sans-serif; background: #f3f4f6; padding: 30px; }
        .card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); max-width: 600px; }
        h3 { margin: 0 0 20px; font-size: 18px; color: #111827; }
        .form-group { margin-bottom: 16px; }
        label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 5px; }
        label span { color: #ef4444; }
        input, select { width: 100%; border: 1.5px solid #d1d5db; border-radius: 8px; padding: 9px 12px; font-size: 14px; box-sizing: border-box; background: #fff; }
        input.error, select.error { border-color: #ef4444; background: #fff5f5; }
        .error-msg { color: #ef4444; font-size: 12px; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
        .btn { background: #6366f1; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; margin-top: 8px; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    </style>`;

    // ss-j6-1: Required error
    await captureHtml(`
        ${css}
        <div class="card">
            <h3>Create Post — Error: Field Wajib Diisi</h3>
            <div class="row">
                <div class="form-group">
                    <label>Title <span>*</span></label>
                    <input class="error" value="" placeholder="Enter title" />
                    <div class="error-msg">⚠ The title field is required.</div>
                </div>
                <div class="form-group">
                    <label>Slug <span>*</span></label>
                    <input class="error" value="" placeholder="Enter slug" />
                    <div class="error-msg">⚠ The slug field is required.</div>
                </div>
            </div>
            <div class="form-group">
                <label>Category <span>*</span></label>
                <select class="error"><option value="">-- Select Category --</option></select>
                <div class="error-msg">⚠ The category field is required.</div>
            </div>
            <div class="form-group">
                <label>Image <span>*</span></label>
                <input class="error" type="text" value="" placeholder="No file chosen" />
                <div class="error-msg">⚠ The image field is required.</div>
            </div>
            <button class="btn">Create</button>
        </div>
    `, '../screenshots/ss-j6-1.png');

    // ss-j6-2: Min length error
    await captureHtml(`
        ${css}
        <div class="card">
            <h3>Create Post — Error: Panjang Karakter Minimum</h3>
            <div class="row">
                <div class="form-group">
                    <label>Title <span>*</span></label>
                    <input class="error" value="ab" />
                    <div class="error-msg">⚠ The title field must be at least 5 characters.</div>
                </div>
                <div class="form-group">
                    <label>Slug <span>*</span></label>
                    <input class="error" value="ab" />
                    <div class="error-msg">⚠ The slug field must be at least 3 characters.</div>
                </div>
            </div>
            <button class="btn">Create</button>
        </div>
    `, '../screenshots/ss-j6-2.png');

    await browser.close();
    console.log("Mock validation screenshots done!");
})();
