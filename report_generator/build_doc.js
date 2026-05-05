const fs = require('fs');
const docx = require('docx');
const sizeOf = require('image-size').imageSize;
const path = require('path');

const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ShadingType, PageBreak, ImageRun } = docx;

// Create screenshots folder if it doesn't exist
const screenshotsDir = "c:/laragon/www/praktikumpwl/screenshots";
if (!fs.existsSync(screenshotsDir)){
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Helper to find image
const findImage = (baseName) => {
    const exts = ['.png', '.jpg', '.jpeg'];
    for (let ext of exts) {
        const fullPath = path.join(screenshotsDir, baseName + ext);
        if (fs.existsSync(fullPath)) {
            return fullPath;
        }
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
            shading: {
                type: ShadingType.CLEAR,
                fill: "2D2D2D"
            },
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
        // Scale down if too large, max width 600
        let width = dimensions.width;
        let height = dimensions.height;
        const MAX_WIDTH = 600;
        if (width > MAX_WIDTH) {
            const ratio = MAX_WIDTH / width;
            width = MAX_WIDTH;
            height = Math.round(height * ratio);
        }

        return new Paragraph({
            children: [
                new ImageRun({
                    data: fs.readFileSync(imagePath),
                    transformation: {
                        width: width,
                        height: height
                    }
                }),
                new TextRun({ break: 1 }),
                new TextRun({ text: label, font: "Arial", size: 20, italic: true }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 240 }
        });
    }

    return new Paragraph({
        children: [
            new TextRun({ text: " ", break: 1 }),
            new TextRun({ text: "[ SLOT SCREENSHOT ]", font: "Arial", size: 24, bold: true }),
            new TextRun({ text: " ", break: 1 }),
            new TextRun({ text: "Simpan gambar sebagai: " + imageBaseName + ".png di dalam folder screenshots", font: "Arial", size: 20, color: "FF0000" }),
            new TextRun({ text: " ", break: 1 }),
            new TextRun({ text: label, font: "Arial", size: 20, italic: true }),
            new TextRun({ text: " ", break: 1 }),
        ],
        alignment: AlignmentType.CENTER,
        border: {
            top: { color: "000000", space: 10, style: BorderStyle.DASHED, size: 6 },
            bottom: { color: "000000", space: 10, style: BorderStyle.DASHED, size: 6 },
            left: { color: "000000", space: 10, style: BorderStyle.DASHED, size: 6 },
            right: { color: "000000", space: 10, style: BorderStyle.DASHED, size: 6 },
        },
        spacing: { before: 240, after: 240 }
    });
};

const doc = new Document({
    sections: [{
        properties: {
            page: {
                margin: { top: 1417, right: 1417, bottom: 1417, left: 1417 }
            }
        },
        children: [
            emptyPara(), emptyPara(), emptyPara(), emptyPara(), emptyPara(),
            new Paragraph({
                children: [new TextRun({ text: "LAPORAN PRAKTIKUM", font: "Arial", size: 36, bold: true })],
                alignment: AlignmentType.CENTER
            }),
            new Paragraph({
                children: [new TextRun({ text: "PEMROGRAMAN WEB LANJUT", font: "Arial", size: 36, bold: true })],
                alignment: AlignmentType.CENTER
            }),
            new Paragraph({
                children: [new TextRun({ text: "Filament PHP v4 + Generate Laporan", font: "Arial", size: 28 })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 240, after: 1000 }
            }),
            
            createPara("Nama      : ALFAN FAHAT MAULANA"),
            createPara("NIM       : _________________"),
            createPara("Kelas     : TI-2H"),
            createPara("Prodi     : D4 Teknik Informatika"),
            createPara("Institusi : Politeknik Negeri Malang"),
            createPara("Tahun     : 2025/2026"),
            
            new Paragraph({ children: [new PageBreak()] }),

            createHeading("JOBSHEET 1 — Instalasi & Setup Filament PHP v4 pada Laravel 11", 1),
            createHeading("Tujuan Pembelajaran", 2),
            createPara("- Menjelaskan konsep dasar Filament PHP"),
            createPara("- Menyebutkan requirement Filament v4"),
            createPara("- Menginstall Laravel 11"),
            createPara("- Menginstall dan mengkonfigurasi Filament v4"),
            createPara("- Membuat user admin Filament"),
            createPara("- Menjalankan dan mengakses admin panel"),

            createHeading("Langkah-Langkah Praktikum", 2),
            createPara("Langkah 1 – Membuat Project Laravel", { runOptions: { bold: true } }),
            ...createCodeBlock("composer create-project laravel/laravel PraktikumPWL\n# Saat instalasi: Starter kit → No | Testing → Pest | Database → SQLite | NPM → Yes | Build → Yes\ncd PraktikumPWL"),
            
            createPara("Langkah 2 – Konfigurasi Database MySQL", { runOptions: { bold: true } }),
            createPara("Edit file .env:"),
            ...createCodeBlock("DB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_PORT=3306\nDB_DATABASE=Filament2026\nDB_USERNAME=root\nDB_PASSWORD="),
            createPara("Jalankan migrasi:"),
            ...createCodeBlock("php artisan migrate"),

            createPara("Langkah 3 – Install Filament v4", { runOptions: { bold: true } }),
            ...createCodeBlock("composer require filament/filament:\"^4.0\"\nphp artisan filament:install --panels\n# Panel ID → admin | GitHub repo → No"),

            createPara("Langkah 4 – Membuat User Admin", { runOptions: { bold: true } }),
            ...createCodeBlock("php artisan make:filament-user\n# Name: Admin User | Email: admin@gmail.com | Password: 123456"),

            createPara("Langkah 5 – Jalankan Aplikasi", { runOptions: { bold: true } }),
            ...createCodeBlock("php artisan serve\n# Akses: http://localhost:8000/admin"),

            createHeading("Hasil Praktikum", 2),
            createPlaceholderOrImage("[ SS-J1-1 ] Halaman Login Filament (http://localhost:8000/admin/login)", "ss-j1-1"),
            createPlaceholderOrImage("[ SS-J1-2 ] Dashboard Admin setelah login", "ss-j1-2"),
            createPlaceholderOrImage("[ SS-J1-3 ] Data 2 user admin di tabel users (phpMyAdmin)", "ss-j1-3"),

            createHeading("Analisis & Diskusi", 2),
            createPara("Kelebihan Filament vs admin panel manual: Filament menyediakan UI siap pakai berbasis Livewire + Tailwind CSS. CRUD, form, tabel, navigasi sudah tersedia tanpa coding dari nol."),
            createPara("Mengapa Filament menggunakan Livewire?: Livewire memungkinkan interaksi real-time frontend-backend tanpa JavaScript manual, form dan tabel reaktif dengan sintaks PHP/Laravel biasa."),
            createPara("Perbedaan SQLite vs MySQL: SQLite tidak butuh server terpisah, cocok untuk dev lokal. MySQL lebih powerful, mendukung multi-user, dan scalable untuk production."),
            createPara("Fungsi Panel Builder: Mengatur seluruh admin panel: routing, autentikasi, navigasi sidebar, dan integrasi resource secara terpusat."),

            createHeading("Kesimpulan", 2),
            createPara("Pada jobsheet ini, dipelajari cara melakukan instalasi Laravel 11 beserta Filament v4 sebagai admin panel builder. Penggunaan Filament sangat mempercepat proses pembuatan halaman admin karena sudah terintegrasi dengan Livewire dan Tailwind CSS secara bawaan. Selain itu, konfigurasi database MySQL telah disiapkan dan user admin berhasil dibuat dan digunakan untuk login ke dalam sistem."),

            new Paragraph({ children: [new PageBreak()] }),

            createHeading("JOBSHEET 2 — Membuat CRUD Resource dengan Filament v4", 1),
            createHeading("Tujuan Pembelajaran", 2),
            createPara("- Memahami konsep Resource pada Filament"),
            createPara("- Membuat CRUD menggunakan perintah artisan"),
            createPara("- Mengelola Form Builder pada Filament"),
            createPara("- Mengelola Table Builder pada Filament"),
            createPara("- Mengubah ikon menu resource"),

            createHeading("Langkah-Langkah Praktikum", 2),
            createPara("Langkah 1 – Lihat daftar perintah Filament", { runOptions: { bold: true } }),
            ...createCodeBlock("php artisan list\n# Perhatikan: make:filament-resource, make:filament-user, filament:install"),

            createPara("Langkah 2 – Buat Resource User", { runOptions: { bold: true } }),
            ...createCodeBlock("php artisan make:filament-resource User\n# Attribute utama → name | Read-only → No | Generate dari DB → No"),

            createPara("Langkah 3 – Edit UserForm.php", { runOptions: { bold: true } }),
            createPara("Path: app/Filament/Admin/Resources/Users/Schemas/UserForm.php"),
            ...createCodeBlock(`<?php\n\nnamespace App\\Filament\\Admin\\Resources\\Users\\Schemas;\n\nuse Filament\\Schemas\\Schema;\nuse Filament\\Forms\\Components\\TextInput;\n\nclass UserForm\n{\n    public static function configure(Schema $schema): Schema\n    {\n        return $schema\n            ->components([\n                TextInput::make('name')\n                    ->required()\n                    ->maxLength(255),\n                TextInput::make('email')\n                    ->email()\n                    ->required()\n                    ->maxLength(255)\n                    ->unique(ignorable: fn ($record) => $record),\n                TextInput::make('password')\n                    ->password()\n                    ->required()\n                    ->minLength(6),\n            ]);\n    }\n}`),

            createPara("Langkah 4 – Edit UsersTable.php", { runOptions: { bold: true } }),
            createPara("Path: app/Filament/Admin/Resources/Users/Tables/UsersTable.php"),
            ...createCodeBlock(`<?php\n\nnamespace App\\Filament\\Admin\\Resources\\Users\\Tables;\n\nuse Filament\\Actions\\BulkActionGroup;\nuse Filament\\Actions\\DeleteBulkAction;\nuse Filament\\Actions\\EditAction;\nuse Filament\\Tables\\Table;\nuse Filament\\Tables\\Columns\\TextColumn;\n\nclass UsersTable\n{\n    public static function configure(Table $table): Table\n    {\n        return $table\n            ->columns([\n                TextColumn::make('name')->searchable()->sortable(),\n                TextColumn::make('email')->searchable()->sortable(),\n                TextColumn::make('created_at')->sortable(),\n            ])\n            ->filters([])\n            ->recordActions([\n                EditAction::make(),\n            ])\n            ->toolbarActions([\n                BulkActionGroup::make([\n                    DeleteBulkAction::make(),\n                ]),\n            ]);\n    }\n}`),

            createPara("Langkah 5 – Ganti Icon Resource", { runOptions: { bold: true } }),
            createPara("Buka UserResource.php, ubah:"),
            ...createCodeBlock("use Filament\\Support\\Icons\\Heroicon;\nprotected static string|BackedEnum|null $navigationIcon = Heroicon::UserGroup;"),

            createHeading("Hasil Praktikum", 2),
            createPlaceholderOrImage("[ SS-J2-1 ] Sidebar menampilkan menu Users", "ss-j2-1"),
            createPlaceholderOrImage("[ SS-J2-2 ] Halaman List Users (kolom name, email, created_at tampil)", "ss-j2-2"),
            createPlaceholderOrImage("[ SS-J2-3 ] Form Create User (field Name, Email, Password)", "ss-j2-3"),
            createPlaceholderOrImage("[ SS-J2-4 ] Data user baru tersimpan di database (phpMyAdmin)", "ss-j2-4"),
            createPlaceholderOrImage("[ SS-J2-5 ] Icon sidebar berubah (sebelum & sesudah)", "ss-j2-5"),

            createHeading("Analisis & Diskusi", 2),
            createPara("Mengapa Filament bisa CRUD tanpa banyak coding?: Menggunakan convention over configuration dan auto-generate file berdasarkan Model Laravel. Developer hanya definisikan schema."),
            createPara("Perbedaan Form Schema vs Table Schema: Form Schema mengatur input (Create/Edit + validasi), Table Schema mengatur tampilan kolom di List (search, sort, bulk action)."),
            createPara("Cara tambah validasi email unik: Menggunakan ->unique(ignorable: fn ($record) => $record) agar saat edit tidak bentrok dengan data sendiri."),
            createPara("Mengapa password tidak perlu di-hash manual?: Model User Laravel menggunakan Hashed cast secara default sehingga password di-hash otomatis via bcrypt."),

            createHeading("Kesimpulan", 2),
            createPara("Jobsheet ini memberikan pemahaman tentang cara cepat membuat operasi CRUD (Create, Read, Update, Delete) menggunakan fitur Resource pada Filament. Dengan mendefinisikan Form Schema dan Table Schema, kita dapat mengatur bagaimana data diinput dan ditampilkan tanpa perlu menulis kode HTML/Blade secara manual. Pengubahan ikon juga dapat dilakukan dengan mudah menggunakan Heroicons yang sudah terintegrasi."),

            new Paragraph({ children: [new PageBreak()] }),

            createHeading("JOBSHEET 3 — Migration, Model, Relasi & Resource Category", 1),
            createHeading("Tujuan Pembelajaran", 2),
            createPara("- Membuat Model dan Migration menggunakan Artisan"),
            createPara("- Mendesain struktur tabel database"),
            createPara("- Mengatur $fillable pada model"),
            createPara("- Menggunakan $casts pada Laravel"),
            createPara("- Membuat relasi antar model (One-to-Many)"),
            createPara("- Membuat Resource Category di Filament"),

            createHeading("Langkah-Langkah Praktikum", 2),
            createPara("Langkah 1 – Buat Model & Migration Category", { runOptions: { bold: true } }),
            ...createCodeBlock("php artisan make:model Category -m"),

            createPara("Langkah 2 – Edit migration categories", { runOptions: { bold: true } }),
            ...createCodeBlock("Schema::create('categories', function (Blueprint $table) {\n    $table->id();\n    $table->string('name');\n    $table->string('slug');\n    $table->timestamps();\n});\n\nphp artisan migrate"),

            createPara("Langkah 3 – Edit Model Category", { runOptions: { bold: true } }),
            createPara("Path: app/Models/Category.php"),
            ...createCodeBlock(`<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Model;\n\nclass Category extends Model\n{\n    protected $fillable = [\n        'name',\n        'slug',\n    ];\n}`),

            createPara("Langkah 4 – Buat Model & Migration Post", { runOptions: { bold: true } }),
            ...createCodeBlock("php artisan make:model Post -m"),

            createPara("Langkah 5 – Edit migration posts", { runOptions: { bold: true } }),
            ...createCodeBlock("Schema::create('posts', function (Blueprint $table) {\n    $table->id();\n    $table->string('title');\n    $table->string('slug');\n    $table->integer('category_id');\n    $table->string('color')->nullable();\n    $table->string('image')->nullable();\n    $table->text('body')->nullable();\n    $table->json('tags')->nullable();\n    $table->boolean('published')->default(false);\n    $table->date('published_at')->nullable();\n    $table->timestamps();\n});\n\nphp artisan migrate"),

            createPara("Langkah 6 – Edit Model Post", { runOptions: { bold: true } }),
            createPara("Path: app/Models/Post.php"),
            ...createCodeBlock(`<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Model;\n\nclass Post extends Model\n{\n    protected $fillable = [\n        'title',\n        'slug',\n        'category_id',\n        'color',\n        'image',\n        'body',\n        'tags',\n        'published',\n        'published_at',\n    ];\n\n    protected $casts = [\n        'tags'         => 'array',\n        'published'    => 'boolean',\n        'published_at' => 'date',\n    ];\n\n    public function category()\n    {\n        return $this->belongsTo(Category::class);\n    }\n}`),

            createPara("Langkah 7 – Buat Resource Category", { runOptions: { bold: true } }),
            ...createCodeBlock("php artisan make:filament-resource Category\n# Attribute utama → name | Read-only → No | Generate dari DB → No"),

            createPara("Langkah 8 – Edit CategoryForm.php", { runOptions: { bold: true } }),
            createPara("Path: app/Filament/Admin/Resources/Categories/Schemas/CategoryForm.php"),
            ...createCodeBlock("TextInput::make('name')\n    ->required(),\nTextInput::make('slug')\n    ->required()\n    ->unique(ignorable: fn ($record) => $record),"),

            createPara("Langkah 9 – Edit CategoriesTable.php", { runOptions: { bold: true } }),
            createPara("Path: app/Filament/Admin/Resources/Categories/Tables/CategoriesTable.php"),
            ...createCodeBlock("TextColumn::make('name'),\nTextColumn::make('slug'),"),

            createHeading("Hasil Praktikum", 2),
            createPlaceholderOrImage("[ SS-J3-1 ] Struktur tabel categories di phpMyAdmin", "ss-j3-1"),
            createPlaceholderOrImage("[ SS-J3-2 ] Struktur tabel posts di phpMyAdmin", "ss-j3-2"),
            createPlaceholderOrImage("[ SS-J3-3 ] Sidebar menampilkan menu Categories", "ss-j3-3"),
            createPlaceholderOrImage("[ SS-J3-4 ] Form Create Category (field Name & Slug)", "ss-j3-4"),
            createPlaceholderOrImage("[ SS-J3-5 ] List Categories dengan minimal 3 data", "ss-j3-5"),

            createHeading("Analisis & Diskusi", 2),
            createPara("Mengapa perlu $fillable?: Melindungi dari mass assignment vulnerability. Hanya field di $fillable yang bisa diisi via create() atau fill(), field sensitif tidak bisa dimanipulasi dari luar."),
            createPara("Fungsi $casts: Konversi tipe data otomatis: JSON menjadi array PHP, 0/1 menjadi boolean true/false, dan string tanggal menjadi Carbon instance."),
            createPara("Perbedaan integer biasa vs foreign key: Integer hanya menyimpan angka. Foreign key punya constraint database yang memastikan nilai selalu ada di tabel referensi (integrity constraint), sehingga mencegah orphan data."),
            createPara("Jika category dihapus tapi masih ada post?: Post jadi orphan (category_id tidak valid). Solusinya dengan menambahkan ->onDelete('cascade') agar post ikut terhapus, atau ->onDelete('set null') untuk mengosongkan nilai category_id."),

            createHeading("Kesimpulan", 2),
            createPara("Pada jobsheet ketiga ini, dipelajari manajemen database di Laravel menggunakan Migration dan Model. Relasi antar tabel seperti One-to-Many dapat didefinisikan secara eksplisit di Model. Fitur seperti $fillable dan $casts pada Eloquent membantu menjaga integritas data dan mempermudah konversi tipe data yang sering digunakan. Dengan integrasi ke Filament, relasi dan struktur ini bisa langsung diatur antarmukanya melalui Resource Category.")
        ]
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("c:/laragon/www/praktikumpwl/Laporan_PWL_Filament_AlfanFahatMaulana.docx", buffer);
    console.log("Document created successfully!");
}).catch(err => {
    console.error("Error creating document:", err);
});
