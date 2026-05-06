const fs = require('fs');
const pdf = require('pdf-parse');

const files = [
    'c:/laragon/www/praktikumpwl/js8/10.JOBSHEET PRAKTIKUM-TableColumnSorting.pdf',
    'c:/laragon/www/praktikumpwl/js8/11.JOBSHEET PRAKTIKUM-Implementasi Search & Filter pada Table Filament.pdf',
    'c:/laragon/www/praktikumpwl/js8/12.JOBSHEET PRAKTIKUM-Implementasi Toggle Column pada Table Filament.pdf'
];

(async () => {
    for (const file of files) {
        if (fs.existsSync(file)) {
            const dataBuffer = fs.readFileSync(file);
            try {
                const data = await pdf(dataBuffer);
                fs.writeFileSync(file + '.txt', data.text);
                console.log('Extracted ' + file);
            } catch (e) {
                console.error('Failed ' + file, e);
            }
        } else {
            console.log('Not found: ' + file);
        }
    }
})();
