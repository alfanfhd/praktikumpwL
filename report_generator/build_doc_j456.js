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

const createCodeBlock = (code) => {
    return [
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
};

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
            // ─── COVER PAGE ───
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
                children: [new TextRun({ text: "Filament PHP v4 — Pertemuan 4, 5 & 6", font: "Arial", size: 28 })],
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

            // ─── JOBSHEET 4 ───
            createHeading("JOBSHEET 4 — Implementasi Form Elements & Resource Post di Filament", 1),
            createHeading("Capaian Pembelajaran", 2),
            createPara("1. Membuat Resource Post di Filament"),
            createPara("2. Menggunakan berbagai Form Components"),
            createPara("3. Menghubungkan Select dengan relasi Category"),
            createPara("4. Mengupload file menggunakan File Upload"),
            createPara("5. Menampilkan data relasi pada tabel"),
            createPara("6. Menggunakan Image Column & Storage Link"),

            createHeading("Langkah-Langkah Praktikum", 2),
            createPara("Langkah 1 – Membuat Resource Post", { runOptions: { bold: true } }),
            ...createCodeBlock("php artisan make:filament-resource Post\n# Model attribute → title | Read-only → No | Generate dari DB → No"),

            createPara("Langkah 2 – Implementasi Form Elements (PostForm.php)", { runOptions: { bold: true } }),
            createPara("Path: app/Filament/Resources/Posts/Schemas/PostForm.php"),
            ...createCodeBlock(`<?php
namespace App\\Filament\\Resources\\Posts\\Schemas;

use Filament\\Forms\\Components\\TextInput;
use Filament\\Forms\\Components\\Select;
use Filament\\Forms\\Components\\ColorPicker;
use Filament\\Forms\\Components\\MarkdownEditor;
use Filament\\Forms\\Components\\FileUpload;
use Filament\\Forms\\Components\\TagsInput;
use Filament\\Forms\\Components\\Checkbox;
use Filament\\Forms\\Components\\DatePicker;
use App\\Models\\Category;

// Di dalam configure():
TextInput::make('title')->required(),
TextInput::make('slug')->required(),
Select::make('category_id')
    ->label('Category')
    ->options(Category::all()->pluck('name', 'id'))
    ->required(),
ColorPicker::make('color'),
MarkdownEditor::make('body'),
FileUpload::make('image')->disk('public')->directory('post'),
TagsInput::make('tags'),
Checkbox::make('published'),
DatePicker::make('published_at'),`),

            createPara("Langkah 3 – Implementasi Table (PostsTable.php)", { runOptions: { bold: true } }),
            createPara("Path: app/Filament/Resources/Posts/Tables/PostsTable.php"),
            ...createCodeBlock(`TextColumn::make('title'),
TextColumn::make('slug'),
TextColumn::make('category.name'),
ColorColumn::make('color'),
ImageColumn::make('image')->disk('public'),
IconColumn::make('published')->boolean(),`),

            createPara("Langkah 4 – Redirect setelah Create & Edit", { runOptions: { bold: true } }),
            createPara("Tambahkan method berikut pada CreatePost.php dan EditPost.php:"),
            ...createCodeBlock(`protected function getRedirectUrl(): string
{
    return $this->getResource()::getUrl('index');
}`),

            createPara("Langkah 5 – Storage Link untuk Gambar", { runOptions: { bold: true } }),
            ...createCodeBlock("php artisan storage:link"),

            createHeading("Hasil Praktikum", 2),
            createPlaceholderOrImage("[ SS-J4-1 ] Form Create Post dengan semua Form Elements", "ss-j4-1"),
            createPlaceholderOrImage("[ SS-J4-2 ] Tabel Post menampilkan kolom title, slug, category, color, image, published", "ss-j4-2"),
            createPlaceholderOrImage("[ SS-J4-3 ] Struktur folder storage/app/public/post", "ss-j4-3"),

            createHeading("Analisis & Diskusi", 2),
            createPara("1. Mengapa kita perlu storage:link?: Karena gambar disimpan di storage/app/public, bukan di public/ secara langsung. Perintah storage:link membuat symbolic link dari public/storage → storage/app/public sehingga gambar bisa diakses via URL browser."),
            createPara("2. Apa fungsi $casts untuk field JSON?: $casts mengonversi data JSON di database menjadi array PHP secara otomatis. Tanpa ini, field tags akan dikembalikan sebagai string JSON mentah, bukan array."),
            createPara("3. Mengapa category.name bukan category_id?: Menampilkan nama lebih informatif bagi pengguna. Filament mendukung dot notation untuk me-resolve relasi Eloquent secara otomatis."),
            createPara("4. Perbedaan RichEditor vs MarkdownEditor?: RichEditor menampilkan toolbar WYSIWYG (What You See Is What You Get) dengan format HTML. MarkdownEditor menggunakan sintaks Markdown yang lebih ringan dan cocok untuk developer."),

            createHeading("Kesimpulan", 2),
            createPara("Pada Jobsheet 4 ini, berhasil dibuat Resource Post yang lengkap dengan berbagai Form Elements bawaan Filament. Resource ini terhubung dengan relasi Category melalui Select, mendukung upload gambar melalui FileUpload, dan menggunakan casting untuk field bertipe JSON dan Boolean. Penampilan data di tabel juga telah dikonfigurasi dengan ImageColumn dan IconColumn agar lebih informatif."),

            new Paragraph({ children: [new PageBreak()] }),

            // ─── JOBSHEET 5 ───
            createHeading("JOBSHEET 5 — Custom Layout Form dengan Section & Group di Filament", 1),
            createHeading("Capaian Pembelajaran", 2),
            createPara("1. Mengatur tata letak form menggunakan sistem grid"),
            createPara("2. Mengelompokkan field dengan komponen Section"),
            createPara("3. Menggunakan Group untuk mengatur layout horizontal"),
            createPara("4. Mengatur lebar field dengan columnSpan"),
            createPara("5. Membuat tampilan form yang profesional"),

            createHeading("Langkah-Langkah Praktikum", 2),
            createPara("Langkah 1 – Layout Dasar dengan Columns", { runOptions: { bold: true } }),
            createPara("Tambahkan ->columns(3) pada schema utama untuk membagi form menjadi 3 kolom:"),
            ...createCodeBlock("->columns(3)  // Sistem grid 12 kolom seperti Tailwind"),

            createPara("Langkah 2 – Menggunakan Section", { runOptions: { bold: true } }),
            createPara("Section mengelompokkan field agar lebih rapi dengan tampilan box, judul, deskripsi, dan ikon:"),
            ...createCodeBlock(`Section::make('Fields')
    ->description('Informasi utama artikel')
    ->icon('heroicon-o-document-text')
    ->schema([
        TextInput::make('title')->required(),
        TextInput::make('slug')->required(),
        Select::make('category_id')...->required(),
        ColorPicker::make('color'),
    ])->columns(2),`),

            createPara("Langkah 3 – Menggunakan Group untuk Layout 2/3 + 1/3", { runOptions: { bold: true } }),
            createPara("Group digunakan untuk mengatur proporsi horizontal tanpa tampilan visual (tanpa box):"),
            ...createCodeBlock(`Group::make([
    Section::make('Fields')->schema([...])->columns(2),
    MarkdownEditor::make('body')->columnSpanFull(),
])->columnSpan(2),  // Mengisi 2/3 lebar

Group::make([
    Section::make('Image Upload')->schema([
        FileUpload::make('image')->disk('public')->directory('post'),
    ]),
    Section::make('Meta')->schema([
        TagsInput::make('tags'),
        Checkbox::make('published'),
        DatePicker::make('published_at'),
    ]),
])->columnSpan(1),  // Mengisi 1/3 lebar`),

            createPara("Langkah 4 – Menerapkan Layout Final", { runOptions: { bold: true } }),
            createPara("Schema utama menggunakan ->columns(3) agar Group dengan columnSpan(2) dan columnSpan(1) bekerja dengan benar:"),
            ...createCodeBlock(`return $schema
    ->components([
        Group::make([...])->columnSpan(2),
        Group::make([...])->columnSpan(1),
    ])
    ->columns(3);`),

            createHeading("Ringkasan Komponen Layout", 2),
            createPara("• columns()        — Membagi field dalam grid"),
            createPara("• Section          — Mengelompokkan field dengan box, judul, dan ikon"),
            createPara("• Group            — Mengatur layout horizontal tanpa tampilan visual"),
            createPara("• columnSpan()     — Mengatur lebar proporsional field"),
            createPara("• columnSpanFull() — Lebar penuh (full width)"),

            createHeading("Hasil Praktikum", 2),
            createPlaceholderOrImage("[ SS-J5-1 ] Form sebelum penerapan layout (default 1 kolom)", "ss-j5-1"),
            createPlaceholderOrImage("[ SS-J5-2 ] Form sesudah layout dengan Section & Group (2/3 + 1/3)", "ss-j5-2"),

            createHeading("Analisis & Diskusi", 2),
            createPara("1. Mengapa layout form penting dalam admin panel?: Layout yang baik membuat form lebih mudah dibaca, mengurangi scrolling, dan meningkatkan produktivitas pengguna."),
            createPara("2. Perbedaan Section dan Group?: Section menampilkan box visual dengan judul dan ikon, cocok untuk pengelompokan yang terlihat. Group mengatur posisi tanpa tampilan, cocok untuk mengatur proporsi kolom."),
            createPara("3. Kapan menggunakan columnSpanFull()?: Saat field membutuhkan lebar penuh, contohnya MarkdownEditor atau TextArea yang membutuhkan ruang lebih besar."),
            createPara("4. Keuntungan sistem grid 12 kolom?: Fleksibilitas tinggi dalam mengatur proporsi. Misalnya, 4+8, 6+6, 8+4, atau 12 (full) sesuai kebutuhan."),

            createHeading("Kesimpulan", 2),
            createPara("Pada Jobsheet 5, berhasil diterapkan sistem layout form profesional menggunakan komponen Section dan Group dari Filament. Dengan sistem grid 3 kolom, form Post kini memiliki tata letak Fields di sisi kiri (2/3 lebar) dan Image Upload & Meta di sisi kanan (1/3 lebar). Tampilan ini lebih terstruktur, rapi, dan profesional dibandingkan layout default satu kolom."),

            new Paragraph({ children: [new PageBreak()] }),

            // ─── JOBSHEET 6 ───
            createHeading("JOBSHEET 6 — Implementasi Form Validation pada Filament", 1),
            createHeading("Capaian Pembelajaran", 2),
            createPara("1. Menerapkan validasi form pada Filament"),
            createPara("2. Menggunakan method required()"),
            createPara("3. Menggunakan rule() dan rules()"),
            createPara("4. Menerapkan validasi unique"),
            createPara("5. Membuat custom validation message"),
            createPara("6. Memahami integrasi validasi Filament dengan validasi Laravel"),

            createHeading("Konsep Validasi di Filament", 2),
            createPara("Filament menggunakan sistem validasi dari Laravel. Artinya semua aturan validasi Laravel dapat digunakan langsung pada komponen form Filament. Validasi diproses di sisi server (server-side), sehingga lebih aman dibandingkan validasi client-side."),

            createHeading("Langkah-Langkah Praktikum", 2),
            createPara("Langkah 1 – Validasi required()", { runOptions: { bold: true } }),
            createPara("Method paling sederhana untuk membuat field wajib diisi. Tanda (*) merah otomatis muncul:"),
            ...createCodeBlock("TextInput::make('title')\n    ->required(),"),

            createPara("Langkah 2 – Validasi Menggunakan rules() (Multiple Rules)", { runOptions: { bold: true } }),
            createPara("Untuk lebih dari satu aturan validasi, gunakan rules() dengan format string (pipe) atau array:"),
            ...createCodeBlock(`// Format String (Pipe)
TextInput::make('title')
    ->required()
    ->rules('min:5|max:100'),

// Format Array
TextInput::make('title')
    ->required()
    ->rules([
        'min:5',
        'max:100',
    ]),`),

            createPara("Langkah 3 – Validasi Unique", { runOptions: { bold: true } }),
            createPara("Untuk field slug agar tidak boleh duplikat. Saat edit, validasi mengabaikan record yang sedang diedit:"),
            ...createCodeBlock(`TextInput::make('slug')
    ->required()
    ->unique(ignorable: fn ($record) => $record)
    ->rules('min:3'),`),

            createPara("Langkah 4 – Custom Validation Message", { runOptions: { bold: true } }),
            createPara("Pesan error validasi dapat dikustomisasi menggunakan validationMessages():"),
            ...createCodeBlock(`TextInput::make('slug')
    ->required()
    ->unique(ignorable: fn ($record) => $record)
    ->validationMessages([
        'unique' => 'Slug harus unik dan tidak boleh sama.',
    ]),`),

            createPara("Langkah 5 – Contoh Validasi Lengkap PostForm.php", { runOptions: { bold: true } }),
            ...createCodeBlock(`TextInput::make('title')
    ->required()
    ->rules('min:5|max:100'),

TextInput::make('slug')
    ->required()
    ->unique(ignorable: fn ($record) => $record)
    ->rules('min:3')
    ->validationMessages([
        'unique' => 'Slug harus unik.',
    ]),

Select::make('category_id')
    ->required(),

FileUpload::make('image')
    ->disk('public')
    ->directory('post')
    ->required(),`),

            createHeading("Referensi Aturan Validasi Laravel", 2),
            createPara("• required        — Wajib diisi"),
            createPara("• min:n           — Minimal n karakter"),
            createPara("• max:n           — Maksimal n karakter"),
            createPara("• email           — Format email"),
            createPara("• numeric         — Hanya angka"),
            createPara("• unique          — Tidak boleh duplikat"),
            createPara("• date            — Format tanggal"),
            createPara("• confirmed       — Konfirmasi password"),

            createHeading("Hasil Praktikum", 2),
            createPlaceholderOrImage("[ SS-J6-1 ] Tampilan error Required — semua field wajib kosong", "ss-j6-1"),
            createPlaceholderOrImage("[ SS-J6-2 ] Tampilan error Min Length — title & slug terlalu pendek", "ss-j6-2"),
            createPlaceholderOrImage("[ SS-J6-3 ] Tampilan error Unique Slug — slug sudah terdaftar", "ss-j6-3"),

            createHeading("Analisis & Diskusi", 2),
            createPara("1. Mengapa validasi penting pada admin panel?: Admin panel berinteraksi langsung dengan database. Validasi mencegah data kotor (dirty data) masuk ke sistem, menjaga integritas database dan mengurangi bug di sisi aplikasi."),
            createPara("2. Perbedaan validasi client-side dan server-side?: Client-side (JavaScript) lebih cepat (tidak perlu kirim ke server) tapi bisa dimanipulasi pengguna. Server-side (Laravel/Filament) lebih aman karena tidak bisa dibypass."),
            createPara("3. Mengapa unique otomatis bekerja saat edit?: Parameter ignorable: fn ($record) => $record memberi tahu Filament untuk mengabaikan baris yang sedang diedit saat mengecek uniqueness, sehingga tidak terjadi false positive."),
            createPara("4. Kapan menggunakan rules array vs string?: String lebih ringkas untuk sedikit aturan. Array lebih mudah dibaca dan di-maintain saat aturan banyak. Array juga mendukung object Rule:: dari Laravel."),

            createHeading("Kesimpulan", 2),
            createPara("Pada Jobsheet 6 ini, berhasil diterapkan sistem validasi form yang komprehensif pada Resource Post. Filament terintegrasi penuh dengan sistem validasi Laravel sehingga semua aturan validasi (required, min, max, unique, dll) dapat digunakan secara langsung. Custom validation message juga berhasil diterapkan untuk memberikan pesan error yang lebih informatif bagi pengguna."),
        ]
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    const outputPath = "c:/laragon/www/praktikumpwl/Laporan_PWL_Filament_J4_J5_J6_AlfanFahatMaulana.docx";
    fs.writeFileSync(outputPath, buffer);
    console.log("Document created: " + outputPath);
}).catch(err => {
    console.error("Error creating document:", err);
});
