<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Item;
use App\Models\SubCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use SoDe\Extend\JSON;
use Illuminate\Support\Str;
use SoDe\Extend\Math;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i < 20; $i++) {
            $name = 'Producto ' . $i;
            $price = Math::floor(rand(100, 200) / 5) * 5;
            $discount = Math::floor(rand(50, 150) / 5) * 5;
            $final_price = $price;
            if ($discount < $price) {
                $final_price = $discount;
            }

            Item::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'summary' => 'Un breve resúmen corto y preciso de ' . $name,
                'description' => 'Aquí una descripción un poco mas larga del ' . $name . '. Esta descripción amplia mas detalles de este producto como información relevante respecto al estado del mismo',
                'featured' => rand(0, 1),
                'recommended' => rand(0, 1),
                'price' => $price,
                'discount' => $discount < $price ? $discount : null,
                'final_price' => $final_price,
                'discount_percent' => 100 - ($final_price / $price * 100),
                'category_id' => Category::all()?->random()?->id,
                'brand_id' => Brand::all()?->random()?->id
            ]);
        }
    }
}
