<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Product::create([
            'name' => 'Laptop ROG Strix',
            'sku' => 'ROG-001',
            'description' => 'Laptop gaming dengan spesifikasi tinggi.',
            'price' => 25000000,
            'stock' => 15,
            'is_active' => true,
            'is_featured' => true,
        ]);

        \App\Models\Product::create([
            'name' => 'Mouse Logitech G502',
            'sku' => 'LOG-G502',
            'description' => 'Mouse gaming ergonomic dengan sensor hero.',
            'price' => 850000,
            'stock' => 50,
            'is_active' => true,
            'is_featured' => false,
        ]);

        \App\Models\Product::create([
            'name' => 'Keyboard Mechanical RK61',
            'sku' => 'RK-61',
            'description' => 'Keyboard mechanical 60% dengan switch merah.',
            'price' => 550000,
            'stock' => 30,
            'is_active' => true,
            'is_featured' => true,
        ]);
    }
}
