const fs = require('fs');
const docx = require('docx');
const sizeOf = require('image-size').imageSize;
const path = require('path');

const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ShadingType, PageBreak, ImageRun } = docx;

const screenshotsDir = "c:/laragon/www/praktikumpwl/screenshots";

const findImage = (baseName) => {
    const exts = ['.png', '.jpg', '.jpeg'];
    for (let ext of exts) {
        const fullPath = path.join(screenshotsDir, baseName + ext);
        if (fs.existsSync(fullPath)) return fullPath;
    }
    return null;
};

const createText = (text, options = {}) => new TextRun({ text, font: "Arial", size: 24, ...options });
const createPara = (text, options = {}) => new Paragraph({ children: [createText(text, options.runOptions)], ...options.paraOptions });
const emptyPara = () => new Paragraph({ text: "" });

const createHeading = (text, level) => new Paragraph({
    children: [new TextRun({ text, font: "Arial", size: level === 1 ? 32 : 28, bold: true })],
    heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 }
});

const createCodeBlock = (code) => [
    new Paragraph({
        children: code.split('\n').map((line, idx) => new TextRun({
            text: line.length > 0 ? line : " ",
            font: "Courier New",
            size: 20,
            color: "FFFFFF",
            break: idx > 0 ? 1 : 0
        })),
        shading: { type: ShadingType.CLEAR, fill: "2D2D2D" },
        spacing: { before: 120, after: 120 },
        border: {
            top: { color: "2D2D2D", space: 10, style: BorderStyle.SINGLE, size: 6 },
            bottom: { color: "2D2D2D", space: 10, style: BorderStyle.SINGLE, size: 6 },
            left: { color: "2D2D2D", space: 10, style: BorderStyle.SINGLE, size: 6 },
            right: { color: "2D2D2D", space: 10, style: BorderStyle.SINGLE, size: 6 },
        }
    })
];

const createPlaceholderOrImage = (label, imageBaseName) => {
    const imagePath = findImage(imageBaseName);
    if (imagePath) {
        const dimensions = sizeOf(fs.readFileSync(imagePath));
        let width = dimensions.width;
        let height = dimensions.height;
        const MAX_WIDTH = 580;
        if (width > MAX_WIDTH) {
            const ratio = MAX_WIDTH / width;
            width = MAX_WIDTH;
            height = Math.round(height * ratio);
        }
        return new Paragraph({
            children: [
                new ImageRun({ data: fs.readFileSync(imagePath), transformation: { width, height } }),
                new TextRun({ break: 1 }),
                new TextRun({ text: label, font: "Arial", size: 20, italic: true }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 }
        });
    }
    return new Paragraph({
        children: [
            new TextRun({ text: `[ SCREENSHOT: ${imageBaseName} ]`, font: "Arial", size: 22, bold: true, color: "FF0000" }),
            new TextRun({ break: 1 }),
            new TextRun({ text: label, font: "Arial", size: 20, italic: true }),
        ],
        alignment: AlignmentType.CENTER,
        border: {
            top: { color: "FF0000", space: 8, style: BorderStyle.DASHED, size: 6 },
            bottom: { color: "FF0000", space: 8, style: BorderStyle.DASHED, size: 6 },
            left: { color: "FF0000", space: 8, style: BorderStyle.DASHED, size: 6 },
            right: { color: "FF0000", space: 8, style: BorderStyle.DASHED, size: 6 },
        },
        spacing: { before: 200, after: 200 }
    });
};

const doc = new Document({
    sections: [{
        properties: {
            page: { margin: { top: 1417, right: 1417, bottom: 1417, left: 1417 } }
        },
        children: [
            // ─── COVER ───
            emptyPara(), emptyPara(), emptyPara(), emptyPara(),
            new Paragraph({
                children: [new TextRun({ text: "LAPORAN PRAKTIKUM", font: "Arial", size: 36, bold: true })],
                alignment: AlignmentType.CENTER
            }),
            new Paragraph({
                children: [new TextRun({ text: "PEMROGRAMAN WEB LANJUT", font: "Arial", size: 36, bold: true })],
                alignment: AlignmentType.CENTER
            }),
            new Paragraph({
                children: [new TextRun({ text: "Filament PHP v4 — Pertemuan 10, 11 & 12", font: "Arial", size: 28 })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 240, after: 1000 }
            }),
            createPara("Nama      : ALFAN FAHAT MAULANA"),
            createPara("NIM       : 25162876305"),
            createPara("Kelas     : TI-2H"),
            createPara("Prodi     : D4 Teknik Informatika"),
            createPara("Institusi : Politeknik Negeri Malang"),
            createPara("Tahun     : 2025/2026"),

            new Paragraph({ children: [new PageBreak()] }),

            // ─── JOBSHEET 10 ───
            createHeading("JOBSHEET 10 — Implementasi Sorting pada Table Filament", 1),
            createHeading("Capaian Pembelajaran", 2),
            createPara("1. Menambahkan fitur sorting kolom pada tabel Filament"),
            createPara("2. Menggunakan method sortable()"),
            createPara("3. Menerapkan sorting pada kolom relasi"),
            createPara("4. Menerapkan sorting pada kolom tanggal"),
            createPara("5. Mengatur default sorting tabel"),

            createHeading("Langkah-Langkah Praktikum", 2),
            createPara("Langkah 1 – Tambahkan sortable() pada kolom", { runOptions: { bold: true } }),
            createPara("Buka PostsTable.php dan tambahkan ->sortable() pada setiap kolom:"),
            ...createCodeBlock(`TextColumn::make('title')
    ->label('Title')
    ->sortable(),

TextColumn::make('slug')
    ->label('Slug')
    ->sortable(),

TextColumn::make('category.name')
    ->label('Category')
    ->sortable(),

TextColumn::make('created_at')
    ->label('Created At')
    ->dateTime('d M Y')
    ->sortable(),`),

            createPara("Langkah 2 – Mengatur Default Sorting", { runOptions: { bold: true } }),
            createPara("Tambahkan ->defaultSort() agar data otomatis tampil dari yang terbaru:"),
            ...createCodeBlock(`return $table
    ->defaultSort('created_at', 'desc')
    ->columns([...])`),

            createHeading("Hasil Praktikum", 2),
            createPlaceholderOrImage("[ SS-J10-1 ] Tabel Post dengan default sort created_at desc", "ss-j10-default"),
            createPlaceholderOrImage("[ SS-J10-2 ] Sorting Title Ascending (A-Z)", "ss-j10-sort-asc"),
            createPlaceholderOrImage("[ SS-J10-3 ] Sorting Title Descending (Z-A)", "ss-j10-sort-desc"),

            createHeading("Analisis & Diskusi", 2),
            createPara("1. Mengapa sorting penting pada admin panel?: Membantu administrator menemukan data lebih cepat. Misalnya, data terbaru di atas, atau judul terurut alfabet agar mudah dibaca."),
            createPara("2. Perbedaan sortable() vs defaultSort(): sortable() mengaktifkan kemampuan klik-untuk-sort pada header kolom. defaultSort() mengatur urutan awal saat halaman pertama dibuka tanpa klik dari user."),
            createPara("3. Mengapa relasi tetap bisa di-sort?: Filament secara otomatis melakukan JOIN dengan tabel relasi saat sortable() dipanggil pada kolom dot-notation seperti category.name."),
            createPara("4. Kapan kita menggunakan desc sebagai default?: Biasanya untuk data berbasis waktu. Data terbaru lebih relevan untuk dilihat terlebih dahulu, contoh: log aktivitas, pesanan terbaru, postingan terbaru."),

            createHeading("Kesimpulan", 2),
            createPara("Pada Jobsheet 10, berhasil diimplementasikan fitur sorting pada tabel Post di Filament menggunakan metode sortable() pada setiap kolom. Default sorting di-set ke created_at descending agar data terbaru selalu tampil paling atas. Filament juga mendukung sorting pada kolom relasi secara otomatis dengan menggunakan dot notation."),

            new Paragraph({ children: [new PageBreak()] }),

            // ─── JOBSHEET 11 ───
            createHeading("JOBSHEET 11 — Implementasi Search & Filter pada Table Filament", 1),
            createHeading("Capaian Pembelajaran", 2),
            createPara("1. Menambahkan fitur Search (Pencarian) pada tabel"),
            createPara("2. Menggunakan method searchable()"),
            createPara("3. Membuat filter berdasarkan tanggal (Date Filter)"),
            createPara("4. Membuat filter berdasarkan relasi (Select Filter)"),
            createPara("5. Menambahkan query custom pada filter"),

            createHeading("Langkah-Langkah Praktikum", 2),
            createPara("Langkah 1 – Tambahkan searchable() pada kolom", { runOptions: { bold: true } }),
            ...createCodeBlock(`TextColumn::make('title')->searchable(),
TextColumn::make('slug')->searchable(),
TextColumn::make('category.name')->searchable(),`),

            createPara("Langkah 2 – Tambahkan Date Filter", { runOptions: { bold: true } }),
            ...createCodeBlock(`use Filament\\Tables\\Filters\\Filter;
use Filament\\Forms\\Components\\DatePicker;
use Illuminate\\Database\\Eloquent\\Builder;

Filter::make('created_at')
    ->label('Creation Date')
    ->schema([
        DatePicker::make('created_at')->label('Select Date'),
    ])
    ->query(function (Builder $query, array $data) {
        return $query->when(
            $data['created_at'],
            fn (Builder $q, $date) => $q->whereDate('created_at', $date)
        );
    }),`),

            createPara("Langkah 3 – Tambahkan Select Filter (Kategori)", { runOptions: { bold: true } }),
            ...createCodeBlock(`use Filament\\Tables\\Filters\\SelectFilter;

SelectFilter::make('category_id')
    ->label('Select Category')
    ->relationship('category', 'name')
    ->preload(),`),

            createHeading("Hasil Praktikum", 2),
            createPlaceholderOrImage("[ SS-J11-1 ] Search bar aktif dengan hasil pencarian 'Laravel'", "ss-j11-search"),
            createPlaceholderOrImage("[ SS-J11-2 ] Panel filter terbuka (Date Filter & Category Filter)", "ss-j11-filter"),
            createPlaceholderOrImage("[ SS-J11-3 ] Filter berdasarkan Kategori", "ss-j11-category-filter"),

            createHeading("Analisis & Diskusi", 2),
            createPara("1. Mengapa search tidak cocok untuk filter tanggal?: Search bekerja dengan LIKE query (pencocokan teks). Format tanggal sangat bervariasi dan tidak bisa diprediksikan dengan teks biasa. Filter berbasis DatePicker menggunakan whereDate yang tepat."),
            createPara("2. Fungsi relationship() pada SelectFilter?: Memberi tahu Filament untuk mengambil data pilihan (options) langsung dari tabel relasi. Filament otomatis melakukan query ke tabel categories untuk mengisi dropdown."),
            createPara("3. Mengapa kita perlu whereDate() pada filter?: Carbon dan MySQL menyimpan timestamp dengan waktu (e.g., '2025-01-10 08:30:00'). whereDate() membandingkan hanya bagian tanggalnya saja, mengabaikan jam/menit/detik."),
            createPara("4. Perbedaan searchable() dan filters(): searchable() membuat search bar global yang memeriksa nilai kolom dengan LIKE. filters() membuat kontrol filter terpisah yang bisa berupa form fields kompleks dengan query logic kustom."),

            createHeading("Kesimpulan", 2),
            createPara("Pada Jobsheet 11, berhasil diimplementasikan fitur Search dan Filter pada tabel Post. Search menggunakan searchable() yang akan otomatis memunculkan search bar di atas tabel. Filter menggunakan dua jenis: Date Filter dengan DatePicker dan custom query logic, serta Select Filter untuk filter berdasarkan relasi kategori."),

            new Paragraph({ children: [new PageBreak()] }),

            // ─── JOBSHEET 12 ───
            createHeading("JOBSHEET 12 — Implementasi Toggle Column pada Table Filament", 1),
            createHeading("Capaian Pembelajaran", 2),
            createPara("1. Menambahkan kolom baru pada tabel Filament"),
            createPara("2. Menggunakan IconColumn untuk boolean"),
            createPara("3. Mengaktifkan fitur toggleable() pada kolom"),
            createPara("4. Mengatur kolom agar tersembunyi secara default"),
            createPara("5. Memahami cara kerja penyimpanan preferensi kolom (session)"),

            createHeading("Langkah-Langkah Praktikum", 2),
            createPara("Langkah 1 – Tambahkan kolom baru (ID & Tags)", { runOptions: { bold: true } }),
            ...createCodeBlock(`TextColumn::make('id')
    ->label('ID')
    ->sortable()
    ->toggleable(isToggledHiddenByDefault: true),

TextColumn::make('tags')
    ->label('Tags')
    ->toggleable(isToggledHiddenByDefault: true),`),

            createPara("Langkah 2 – Aktifkan toggleable() pada semua kolom", { runOptions: { bold: true } }),
            ...createCodeBlock(`TextColumn::make('title')->toggleable(),
TextColumn::make('slug')->toggleable(),
TextColumn::make('category.name')->toggleable(),
ColorColumn::make('color')->toggleable(),
ImageColumn::make('image')->disk('public')->toggleable(),
IconColumn::make('published')->boolean()->toggleable(),
TextColumn::make('created_at')->dateTime('d M Y')->toggleable(),`),

            createHeading("Hasil Praktikum", 2),
            createPlaceholderOrImage("[ SS-J12-1 ] Tampilan tabel Post sebelum toggle (semua kolom tampil)", "ss-j12-before"),
            createPlaceholderOrImage("[ SS-J12-2 ] Menu toggle kolom terbuka", "ss-j12-toggle-menu"),
            createPlaceholderOrImage("[ SS-J12-3 ] Tampilan setelah beberapa kolom disembunyikan", "ss-j12-after"),

            createHeading("Analisis & Diskusi", 2),
            createPara("1. Mengapa toggle column penting pada admin panel?: Dengan banyak data dan kolom, toggle column memungkinkan administrator menyesuaikan tampilan tabel sesuai kebutuhan tanpa harus mengubah kode. Ini meningkatkan UX secara signifikan."),
            createPara("2. Perbedaan toggleable() dan isToggledHiddenByDefault: toggleable() saja berarti kolom tampil secara default dan bisa disembunyikan oleh user. isToggledHiddenByDefault: true berarti kolom tersembunyi secara default dan harus diaktifkan secara manual oleh user."),
            createPara("3. Mengapa preferensi kolom tetap tersimpan?: Filament menyimpan preferensi kolom (kolom mana yang aktif/nonaktif) dalam browser session. Saat pindah halaman dan kembali, session masih ada sehingga konfigurasi dipertahankan."),
            createPara("4. Kapan kolom sebaiknya disembunyikan secara default?: Kolom dengan data sekunder (ID, tag, metadata) atau kolom yang jarang dibutuhkan dalam pekerjaan sehari-hari sebaiknya disembunyikan agar tampilan awal tetap bersih."),

            createHeading("Kesimpulan", 2),
            createPara("Pada Jobsheet 12, berhasil diimplementasikan fitur Toggle Column pada tabel Post. Semua kolom diberi toggleable() agar dapat disembunyikan sesuai kebutuhan. Dua kolom (ID dan Tags) diatur agar tersembunyi secara default menggunakan isToggledHiddenByDefault: true. Fitur ini meningkatkan fleksibilitas tampilan tabel di admin panel."),
        ]
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    const outputPath = "c:/laragon/www/praktikumpwl/Laporan_PWL_Filament_J10_J11_J12_AlfanFahatMaulana.docx";
    fs.writeFileSync(outputPath, buffer);
    console.log("Document created: " + outputPath);
}).catch(err => {
    console.error("Error creating document:", err);
});
