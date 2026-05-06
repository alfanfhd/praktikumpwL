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
                children: [new TextRun({ text: "Filament PHP v4 — Pertemuan 7, 8 & 9", font: "Arial", size: 28 })],
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

            // ─── JOBSHEET 7 ───
            createHeading("JOBSHEET 7 — Implementasi Wizard Form (Multi Step Form)", 1),
            createHeading("Langkah-Langkah Praktikum", 2),
            createPara("Langkah 1 – Membuat Resource Product", { runOptions: { bold: true } }),
            ...createCodeBlock("php artisan make:filament-resource Product --view"),
            
            createPara("Langkah 2 – Implementasi Wizard Form (ProductForm.php)", { runOptions: { bold: true } }),
            ...createCodeBlock(`Wizard::make([
    Wizard\\Step::make('Product Info')
        ->icon('heroicon-o-information-circle')
        ->schema([
            Group::make([
                TextInput::make('name')->required(),
                TextInput::make('sku')->required(),
            ])->columns(2),
            MarkdownEditor::make('description')->columnSpanFull(),
        ]),
    Wizard\\Step::make('Pricing & Stock')
        ->icon('heroicon-o-currency-dollar')
        ->schema([
            TextInput::make('price')->numeric()->minValue(1)->required(),
            TextInput::make('stock')->numeric()->required(),
        ]),
    Wizard\\Step::make('Media & Status')
        ->icon('heroicon-o-photo')
        ->schema([
            FileUpload::make('image')->disk('public')->directory('products'),
            Checkbox::make('is_active')->default(true),
            Checkbox::make('is_featured')->default(false),
        ]),
])
->submitAction(
    Action::make('save')
        ->label('Save Product')
        ->color('primary')
        ->submit('save')
)->columnSpanFull()`),

            createPara("Langkah 3 – Menghilangkan Default Button (CreateProduct.php)", { runOptions: { bold: true } }),
            ...createCodeBlock(`protected function getFormActions(): array
{
    return [];
}`),

            createHeading("Hasil Praktikum", 2),
            createPlaceholderOrImage("[ SS-J7-1 ] Tabel Product", "ss-j7-table"),
            createPlaceholderOrImage("[ SS-J7-2 ] Wizard Step 1: Product Info", "ss-j7-step1"),
            createPlaceholderOrImage("[ SS-J7-3 ] Wizard Step 2: Pricing & Stock", "ss-j7-step2"),
            createPlaceholderOrImage("[ SS-J7-4 ] Wizard Step 3: Media & Status", "ss-j7-step3"),

            new Paragraph({ children: [new PageBreak()] }),

            // ─── JOBSHEET 8 & 9 ───
            createHeading("JOBSHEET 8 & 9 — Info List dan Tabs di Halaman View", 1),
            createHeading("Langkah-Langkah Praktikum", 2),
            createPara("Langkah 1 – Mengonfigurasi Tabs (ProductInfolist.php)", { runOptions: { bold: true } }),
            ...createCodeBlock(`Tabs::make('Product Tabs')
    ->vertical()
    ->tabs([
        Tabs\\Tab::make('Product Info')
            ->icon('heroicon-o-academic-cap')
            ->schema([
                TextEntry::make('name')->weight('bold')->color('primary'),
                TextEntry::make('sku')->badge()->color('success'),
                TextEntry::make('description'),
            ]),
        Tabs\\Tab::make('Pricing & Stock')
            ->icon('heroicon-o-currency-dollar')
            ->badge(fn ($record) => $record?->stock ?? '0')
            ->badgeColor('info')
            ->schema([
                TextEntry::make('price')
                    ->formatStateUsing(fn ($state) => 'Rp ' . number_format($state, 0, ',', '.')),
                TextEntry::make('stock'),
            ]),
        Tabs\\Tab::make('Media & Status')
            ->icon('heroicon-o-photo')
            ->schema([
                ImageEntry::make('image')->disk('public'),
                IconEntry::make('is_active')->boolean(),
                TextEntry::make('created_at')->date('d M Y')->color('info'),
            ]),
    ])
    ->columnSpanFull()`),

            createHeading("Hasil Praktikum", 2),
            createPlaceholderOrImage("[ SS-J89-1 ] Tab Product Info (dengan icon dan badge pada SKU)", "ss-j9-tab1"),
            createPlaceholderOrImage("[ SS-J89-2 ] Tab Pricing & Stock (dengan format harga Rp dan icon)", "ss-j9-tab2"),
            createPlaceholderOrImage("[ SS-J89-3 ] Tab Media & Status (dengan icon boolean)", "ss-j9-tab3"),

            createHeading("Analisis & Diskusi", 2),
            createPara("1. Mengapa Wizard Form lebih baik?: Wizard memecah form panjang menjadi bagian-bagian yang lebih kecil, mengurangi beban kognitif pengguna dan membuat tampilan lebih bersih."),
            createPara("2. Kapan menggunakan InfoList dibanding Form Input?: InfoList digunakan pada halaman View untuk menampilkan data secara read-only. Menampilkan form input pada halaman view akan membingungkan pengguna (dikira bisa diedit)."),
            createPara("3. Kelebihan Tabs pada InfoList?: Mencegah scrolling panjang dengan mengelompokkan detail informasi berdasarkan kategori. Navigasi antarkategori menjadi lebih intuitif."),
            
            createHeading("Kesimpulan", 2),
            createPara("Pada Jobsheet 7, 8, dan 9 ini telah diimplementasikan UI/UX yang lebih baik menggunakan fitur-fitur lanjutan Filament. Pembuatan resource dikelola dengan Multi-step form (Wizard) untuk mempermudah entri data, dan halaman detail (View) dipercantik dengan menggunakan InfoList yang dikelompokkan dalam Tabs Vertikal yang dilengkapi ikon, badge, dan format khusus."),
        ]
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    const outputPath = "c:/laragon/www/praktikumpwl/Laporan_PWL_Filament_J7_J8_J9_AlfanFahatMaulana.docx";
    fs.writeFileSync(outputPath, buffer);
    console.log("Document created: " + outputPath);
}).catch(err => {
    console.error("Error creating document:", err);
});
