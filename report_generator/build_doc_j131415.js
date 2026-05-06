const { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType, PageBreak, BorderStyle, ShadingType } = require("docx");
const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size").imageSize;

const DOC_PATH = "c:/laragon/www/praktikumpwl/Laporan_PWL_Filament_J13_J14_J15_AlfanFahatMaulana.docx";
const SS_DIR = "c:/laragon/www/praktikumpwl/screenshots/";

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

const getSSPara = (label, imageBaseName) => {
    const p = path.join(SS_DIR, imageBaseName + ".png");
    if (!fs.existsSync(p)) {
        return new Paragraph({
            children: [new TextRun({ text: `[ MISSING SCREENSHOT: ${imageBaseName} ]`, color: "FF0000", bold: true })],
            alignment: AlignmentType.CENTER
        });
    }
    const dimensions = sizeOf(fs.readFileSync(p));
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
            new ImageRun({ data: fs.readFileSync(p), transformation: { width, height } }),
            new TextRun({ break: 1 }),
            new TextRun({ text: label, font: "Arial", size: 20, italic: true }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 }
    });
};

const doc = new Document({
    sections: [{
        properties: {
            page: { margin: { top: 1417, right: 1417, bottom: 1417, left: 1417 } }
        },
        children: [
            // --- COVER ---
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
                children: [new TextRun({ text: "Filament PHP v4 — Pertemuan 13, 14 & 15", font: "Arial", size: 28 })],
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

            // --- JOBSHEET 13 ---
            createHeading("JOBSHEET 13 — Implementasi Table Actions & Custom Action", 1),
            createHeading("Capaian Pembelajaran", 2),
            createPara("1. Menambahkan Record Actions pada tabel Filament"),
            createPara("2. Menggunakan predefined actions (Delete, Replicate)"),
            createPara("3. Membuat custom action pada tabel"),
            createPara("4. Mengupdate data langsung dari tabel tanpa masuk ke halaman edit"),

            createHeading("Langkah-Langkah Praktikum", 2),
            createPara("Langkah 1 – Tambahkan Action pada recordActions", { runOptions: { bold: true } }),
            ...createCodeBlock(`EditAction::make(),
DeleteAction::make(),
ReplicateAction::make(),
Action::make('status')
    ->label('Status Change')
    ->schema([
        Checkbox::make('published')
            ->default(fn ($record): bool => (bool) $record->published),
    ])
    ->action(function ($record, $data) {
        $record->update(['published' => $data['published']]);
    }),`),

            createHeading("Hasil Praktikum", 2),
            getSSPara("Tabel Post dengan Delete, Replicate, dan Status Action", "ss-j1314-table"),
            getSSPara("Modal Custom Status Change", "ss-j13-status-modal"),

            new Paragraph({ children: [new PageBreak()] }),

            // --- JOBSHEET 14 ---
            createHeading("JOBSHEET 14 — Implementasi Relation pada Filament (HasMany)", 1),
            createHeading("Capaian Pembelajaran", 2),
            createPara("1. Memahami konsep relationship pada Laravel dan Filament"),
            createPara("2. Menggunakan method relationship() pada form Filament"),
            createPara("3. Menampilkan data relasi pada tabel Filament"),
            createPara("4. Membuat Relationship Manager"),

            createHeading("Langkah-Langkah Praktikum", 2),
            createPara("Langkah 1 – Update Model Category", { runOptions: { bold: true } }),
            ...createCodeBlock(`public function posts()
{
    return $this->hasMany(Post::class);
}`),
            createPara("Langkah 2 – Gunakan relationship() pada PostForm", { runOptions: { bold: true } }),
            ...createCodeBlock(`Select::make('category_id')
    ->relationship('category', 'name')
    ->searchable()`),

            createHeading("Hasil Praktikum", 2),
            getSSPara("Form Post dengan Dropdown Kategori yang Searchable", "ss-j1415-form"),
            getSSPara("Relationship Manager di Halaman Edit Category", "ss-j14-rel-manager"),

            new Paragraph({ children: [new PageBreak()] }),

            // --- JOBSHEET 15 ---
            createHeading("JOBSHEET 15 — Implementasi Many-to-Many Relationship pada Filament", 1),
            createHeading("Capaian Pembelajaran", 2),
            createPara("1. Memahami konsep Many-to-Many Relationship pada database"),
            createPara("2. Membuat pivot table (post_tag)"),
            createPara("3. Menggunakan multiple select relationship pada form Filament"),
            createPara("4. Mengelola relasi menggunakan Relationship Manager"),

            createHeading("Langkah-Langkah Praktikum", 2),
            createPara("Langkah 1 – Buat Model Tag dan Pivot Table", { runOptions: { bold: true } }),
            createPara("Membuat tabel tags dan post_tag melalui migration."),
            createPara("Langkah 2 – Setup Model Post", { runOptions: { bold: true } }),
            ...createCodeBlock(`public function tags()
{
    return $this->belongsToMany(Tag::class, 'post_tag');
}`),

            createHeading("Hasil Praktikum", 2),
            getSSPara("Tabel Resource Tag", "ss-j15-tags-table"),
            getSSPara("Tags Relationship Manager di Halaman Edit Post", "ss-j15-rel-manager"),
        ],
    }],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(DOC_PATH, buffer);
    console.log("Document created: " + DOC_PATH);
});
