const fs = require('fs');
const pdf = require('pdf-parse');

const files = [
    'c:/laragon/www/praktikumpwl/JS10/13.JOBSHEET PRAKTIKUM-Table Actions in Defth.pdf',
    'c:/laragon/www/praktikumpwl/JS10/14.JOBSHEET PRAKTIKUM-Implementasi Relation pada Filament.pdf',
    'c:/laragon/www/praktikumpwl/JS10/15.JOBSHEET PRAKTIKUM-Implementasi Many-to-Many Relationship pada Filament.pdf'
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
