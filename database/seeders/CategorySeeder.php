<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i=1; $i <= 6; $i++) { 
            $name = 'Categoría ' . $i;
            $slug = Str::slug($name);
            Category::updateOrCreate([
                'slug' => $slug
            ],[
                'name' => 'Categoría ' . $i,
                'featured' => true
            ]);
        }
    }
}
