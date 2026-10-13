<?php
namespace App\Services;

use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;
use App\Models\Item;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Brand;
use App\Models\ItemSpecification;
use App\Models\ItemImage;
use Illuminate\Support\Str;

class ItemImportService
{
    public function importItemsFromExcel($filePath)
    {
        // Vaciar las tablas relacionadas con items
        ItemSpecification::truncate();
        ItemImage::truncate();
        Item::truncate();

        $rows = Excel::toArray([], $filePath)[0]; // Obtener los datos en array

        foreach ($rows as $row) {
            // Buscar o crear la categoría
            $category = Category::firstOrCreate(['name' => $row['categoria']]);

            // Buscar o crear la subcategoría, asegurando que pertenezca a la categoría correcta
            $subCategory = SubCategory::firstOrCreate(
                ['name' => $row['subcategoria'], 'category_id' => $category->id]
            );

            // Buscar o crear la marca
            $brand = Brand::firstOrCreate(['name' => $row['marca']]);

            // Obtener la imagen principal
            $sku = $row['sku'];
            $imagePath = storage_path("app/images/item/");
            $mainImage = null;
            $files = glob("{$imagePath}{$sku}.*");

            if (!empty($files)) {
                $mainImage = basename($files[0]); // Primera coincidencia como imagen principal
            }

            // Crear el item
            $item = Item::create([
                'name' => $row['nombre'],
                'slug' => Str::slug($row['nombre']),
                'summary' => $row['resumen'],
                'description' => $row['descripcion'],
                'price' => $row['precio'],
                'sku' => $row['sku'],
                'category_id' => $category->id,
                'subcategory_id' => $subCategory->id,
                'brand_id' => $brand->id,
                'stock' => $row['stock'] ?? 0,
                'image' => $mainImage, // Guardar solo el nombre de la imagen principal
            ]);

            // Guardar especificaciones principales
            $principalSpecs = explode(',', $row['especificaciones_principales']);
            foreach ($principalSpecs as $spec) {
                ItemSpecification::create([
                    'item_id' => $item->id,
                    'type' => 'principal',
                    'title' => null,
                    'description' => trim($spec),
                ]);
            }

            // Guardar especificaciones generales
            $generalSpecs = explode(',', $row['especificaciones_generales']);
            foreach ($generalSpecs as $spec) {
                $parts = explode(':', $spec, 2);
                $title = isset($parts[1]) ? trim($parts[0]) : null;
                $description = isset($parts[1]) ? trim($parts[1]) : trim($parts[0]);

                ItemSpecification::create([
                    'item_id' => $item->id,
                    'type' => 'general',
                    'title' => $title,
                    'description' => $description,
                ]);
            }

            // Procesar imágenes de galería
            $galleryFiles = glob("{$imagePath}{$sku}_*.*");

            foreach ($galleryFiles as $file) {
                ItemImage::create([
                    'item_id' => $item->id,
                    'url' => basename($file), // Guardar solo el nombre del archivo
                ]);
            }
        }
    }
}
