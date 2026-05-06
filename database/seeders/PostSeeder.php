<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $tech     = Category::create(['name' => 'Teknologi', 'slug' => 'teknologi']);
        $design   = Category::create(['name' => 'Desain', 'slug' => 'desain']);
        $tutorial = Category::create(['name' => 'Tutorial', 'slug' => 'tutorial']);

        $laravel = Tag::create(['name' => 'Laravel']);
        $php = Tag::create(['name' => 'PHP']);
        $filament = Tag::create(['name' => 'Filament']);
        $tailwind = Tag::create(['name' => 'Tailwind']);

        $p1 = Post::create([
            'title' => 'Belajar Laravel 11 dari Awal',
            'slug' => 'belajar-laravel-11',
            'category_id' => $tech->id,
            'color' => '#3B82F6',
            'body' => 'Laravel 11 hadir dengan fitur baru yang sangat menarik.',
            'published' => true,
            'published_at' => '2025-01-10',
        ]);
        $p1->tags()->attach([$laravel->id, $php->id]);

        $p2 = Post::create([
            'title' => 'Filament PHP Admin Panel',
            'slug' => 'filament-php-admin',
            'category_id' => $tech->id,
            'color' => '#8B5CF6',
            'body' => 'Filament mempermudah pembuatan admin panel di Laravel.',
            'published' => true,
            'published_at' => '2025-02-15',
        ]);
        $p2->tags()->attach([$filament->id, $laravel->id]);

        $p3 = Post::create([
            'title' => 'Desain UI Modern dengan Tailwind',
            'slug' => 'desain-ui-tailwind',
            'category_id' => $design->id,
            'color' => '#10B981',
            'body' => 'Tailwind CSS memungkinkan membuat UI bersih dan modern.',
            'published' => false,
            'published_at' => null,
        ]);
        $p3->tags()->attach([$tailwind->id]);
    }
}
