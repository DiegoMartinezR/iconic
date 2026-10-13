<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;


class SubCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i=1; $i < 20; $i++) {
            $name = 'Subcategoría ' . $i;
            $slug = Str::slug($name);
            SubCategory::updateOrCreate([
                'slug' => $slug
            ],[
                'category_id' => Category::all()?->random()?->id,
                'name' => $name,
                'featured' => rand(0, 1)
            ]);
        }
    }
}
