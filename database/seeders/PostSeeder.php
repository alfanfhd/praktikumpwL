<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Post;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $tech     = Category::create(['name' => 'Teknologi', 'slug' => 'teknologi']);
        $design   = Category::create(['name' => 'Desain', 'slug' => 'desain']);
        $tutorial = Category::create(['name' => 'Tutorial', 'slug' => 'tutorial']);

        Post::create([
            'title' => 'Belajar Laravel 11 dari Awal',
            'slug' => 'belajar-laravel-11',
            'category_id' => $tech->id,
            'color' => '#3B82F6',
            'tags' => ['laravel', 'php', 'web'],
            'body' => 'Laravel 11 hadir dengan fitur baru yang sangat menarik.',
            'published' => true,
            'published_at' => '2025-01-10',
        ]);

        Post::create([
            'title' => 'Filament PHP Admin Panel',
            'slug' => 'filament-php-admin',
            'category_id' => $tech->id,
            'color' => '#8B5CF6',
            'tags' => ['filament', 'admin', 'panel'],
            'body' => 'Filament mempermudah pembuatan admin panel di Laravel.',
            'published' => true,
            'published_at' => '2025-02-15',
        ]);

        Post::create([
            'title' => 'Desain UI Modern dengan Tailwind',
            'slug' => 'desain-ui-tailwind',
            'category_id' => $design->id,
            'color' => '#10B981',
            'tags' => ['tailwind', 'ui', 'css'],
            'body' => 'Tailwind CSS memungkinkan membuat UI bersih dan modern.',
            'published' => false,
            'published_at' => null,
        ]);

        Post::create([
            'title' => 'Tutorial CRUD dengan Filament v4',
            'slug' => 'tutorial-crud-filament',
            'category_id' => $tutorial->id,
            'color' => '#F59E0B',
            'tags' => ['crud', 'tutorial', 'filament'],
            'body' => 'Panduan lengkap membuat CRUD menggunakan Filament v4.',
            'published' => true,
            'published_at' => '2025-03-20',
        ]);

        Post::create([
            'title' => 'Memahami Eloquent ORM di Laravel',
            'slug' => 'eloquent-orm-laravel',
            'category_id' => $tech->id,
            'color' => '#EF4444',
            'tags' => ['eloquent', 'orm', 'database'],
            'body' => 'Eloquent mempermudah interaksi dengan database di Laravel.',
            'published' => true,
            'published_at' => '2025-04-05',
        ]);
    }
}
