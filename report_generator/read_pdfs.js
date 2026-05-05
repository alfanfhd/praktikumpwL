const fs = require('fs');
const pdf = require('pdf-parse');

const files = [
    "c:/laragon/www/praktikumpwl/JOBSHET/4.JOBSHEET PRAKTIKUM-Implementasi Form Elements & Resource Post di Filament.pdf",
    "c:/laragon/www/praktikumpwl/JOBSHET/5.JOBSHEET PRAKTIKUM-Custom Layout Form dengan Section & Group di Filament.pdf",
    "c:/laragon/www/praktikumpwl/JOBSHET/6.JOBSHEET PRAKTIKUM-Form Validation Guide.pdf"
];

(async () => {
    for (let f of files) {
        if (fs.existsSync(f)) {
            let dataBuffer = fs.readFileSync(f);
            try {
                let data = await pdf(dataBuffer);
                console.log(`\n\n--- CONTENT OF ${f} ---\n\n`);
                console.log(data.text);
            } catch (e) {
                console.error(`Error reading ${f}: ${e.message}`);
            }
        } else {
            console.log(`File not found: ${f}`);
        }
    }
})();
