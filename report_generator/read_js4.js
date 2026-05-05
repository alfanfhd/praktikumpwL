const fs = require('fs');
const pdf = require('pdf-parse');

const f = "c:/laragon/www/praktikumpwl/JOBSHET/4.JOBSHEET PRAKTIKUM-Implementasi Form Elements & Resource Post di Filament.pdf";
let dataBuffer = fs.readFileSync(f);
pdf(dataBuffer).then(function(data) {
    console.log(data.text);
});
