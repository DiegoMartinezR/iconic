<?php

namespace App\Exports;

use App\Models\DiscountRule;
use App\Models\Item;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UnifiedItemExport implements FromCollection, WithColumnWidths, WithHeadings, WithMapping, WithStyles
{
    protected ?array $activeColumns = null;

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Item::with([
            'collection',
            'category',
            'subcategory',
            'brand',
            'store',
            'tags',
        ])->get();
    }

    /**
     * Obtener dinámicamente las columnas activas según Item::columns()
     */
    protected function getActiveColumns(): array
    {
        if ($this->activeColumns !== null) {
            return $this->activeColumns;
        }

        $columnsConfig = Item::columns();

        $allColumns = [
            'sku' => [
                'heading' => 'SKU',
                'value' => fn ($item) => $item->sku ?? '',
                'width' => 15,
            ],
            'agrupador' => [
                'heading' => 'Agrupador',
                'value' => fn ($item) => $item->agrupador ?? '',
                'width' => 18,
            ],
            'name' => [
                'heading' => 'Nombre del producto',
                'value' => fn ($item) => $item->name ?? '',
                'width' => 35,
            ],
            'summary' => [
                'heading' => 'Resumen',
                'value' => fn ($item) => $this->cleanHtmlDescription($item->summary ?? ''),
                'width' => 35,
            ],
            'description' => [
                'heading' => 'Descripcion',
                'value' => fn ($item) => $this->cleanHtmlDescription($item->description ?? ''),
                'width' => 50,
            ],
            'category_id' => [
                'heading' => 'Categoria',
                'value' => fn ($item) => $item->category->name ?? '',
                'width' => 20,
            ],
            'collection_id' => [
                'heading' => 'Colleccion',
                'value' => fn ($item) => $item->collection->name ?? '',
                'width' => 20,
            ],
            'subcategory_id' => [
                'heading' => 'Subcategoría',
                'value' => fn ($item) => $item->subcategory->name ?? '',
                'width' => 20,
            ],
            'brand_id' => [
                'heading' => 'Marca',
                'value' => fn ($item) => $item->brand->name ?? '',
                'width' => 20,
            ],
            'color' => [
                'heading' => 'Color',
                'value' => fn ($item) => $item->color ?? '',
                'width' => 12,
            ],
            'size' => [
                'heading' => 'Talla',
                'value' => fn ($item) => $item->size ?? '',
                'width' => 12,
            ],
            'price' => [
                'heading' => 'Precio',
                'value' => fn ($item) => $item->price ?? 0,
                'width' => 12,
            ],
            'discount' => [
                'heading' => 'Descuento',
                'value' => fn ($item) => $item->discount ?? 0,
                'width' => 12,
            ],
            'stock' => [
                'heading' => 'Stock',
                'value' => fn ($item) => $item->stock ?? 0,
                'width' => 10,
            ],
            'stock_unlimited' => [
                'heading' => 'Stock ilimitado',
                'value' => fn ($item) => $this->formatBoolean($item->stock_unlimited),
                'width' => 15,
            ],
            'weight' => [
                'heading' => 'Peso',
                'value' => fn ($item) => $item->weight ?? 0,
                'width' => 10,
            ],
            'store_id' => [
                'heading' => 'Tienda',
                'value' => fn ($item) => $item->store->name ?? '',
                'width' => 20,
            ],
            'is_new' => [
                'heading' => 'Es nuevo',
                'value' => fn ($item) => $this->formatBoolean($item->is_new),
                'width' => 12,
            ],
            'offering' => [
                'heading' => 'En oferta',
                'value' => fn ($item) => $this->formatBoolean($item->offering),
                'width' => 12,
            ],
            'recommended' => [
                'heading' => 'Recomendado',
                'value' => fn ($item) => $this->formatBoolean($item->recommended),
                'width' => 12,
            ],
            'featured' => [
                'heading' => 'Destacado',
                'value' => fn ($item) => $this->formatBoolean($item->featured),
                'width' => 12,
            ],
            'visible' => [
                'heading' => 'Visible',
                'value' => fn ($item) => $this->formatBoolean($item->visible),
                'width' => 12,
            ],
            'status' => [
                'heading' => 'Estado',
                'value' => fn ($item) => $this->formatBoolean($item->status),
                'width' => 12,
            ],
            'is_master' => [
                'heading' => 'Es maestro',
                'value' => fn ($item) => $this->formatBoolean($item->is_master),
                'width' => 12,
            ],

            'is_features' => [
                'heading' => 'Características (separadas por coma)',
                'value' => fn ($item) => $this->getFeatures($item),
                'width' => 40,
                'check' => fn () => ($columnsConfig['is_features'] ?? true),
            ],

            'is_main_specifications' => [
                'heading' => 'Especificaciones principales',
                'value' => fn ($item) => $this->getMainSpecifications($item),
                'width' => 40,
                'check' => fn () => ($columnsConfig['is_main_specifications'] ?? true) || ($columnsConfig['is_specifications'] ?? true),
            ],
            'is_specifications_tecnicas' => [
                'heading' => 'Especificaciones técnicas (separadas por slash y dos puntos)',
                'value' => fn ($item) => $this->getTechnicalSpecifications($item),
                'width' => 45,
                'check' => fn () => ($columnsConfig['is_specifications'] ?? true),
            ],
            'is_attributes_name' => [
                'heading' => 'Atributos',
                'value' => fn ($item) => $this->getAttributes($item),
                'width' => 30,
                'check' => fn () => ($columnsConfig['is_attributes'] ?? true) || ($columnsConfig['atributo'] ?? true),
            ],
            'is_attributes_val' => [
                'heading' => 'Valores',
                'value' => fn ($item) => $this->getAttributeValues($item),
                'width' => 30,
                'check' => fn () => ($columnsConfig['is_attributes'] ?? true) || ($columnsConfig['valor'] ?? true),
            ],
            'image' => [
                'heading' => 'Imagen',
                'value' => fn ($item) => $this->getMainImageUrl($item),
                'width' => 45,
                'always' => true,
            ],
            'galeria' => [
                'heading' => 'Galería',
                'value' => fn ($item) => $this->getGalleryImagesUrl($item),
                'width' => 60,
                'always' => true,
            ],
            'regla_descuento' => [
                'heading' => 'Regla de descuento',
                'value' => fn ($item) => $this->getDiscountRules($item),
                'width' => 25,
                'check' => fn () => ($columnsConfig['is_discount_rules'] ?? true),
            ],
            'promociones' => [
                'heading' => 'Promociones',
                'value' => fn ($item) => $this->getPromotions($item),
                'width' => 30,
                'check' => fn () => ($columnsConfig['is_tags'] ?? true),
            ],
        ];

        $this->activeColumns = [];

        foreach ($allColumns as $key => $config) {
            $isEnabled = false;

            if (! empty($config['always'])) {
                $isEnabled = true;
            } elseif (isset($config['check']) && is_callable($config['check'])) {
                $isEnabled = (bool) $config['check']();
            } else {
                if (array_key_exists($key, $columnsConfig)) {
                    $isEnabled = (bool) $columnsConfig[$key];
                } else {
                    $isEnabled = true;
                }
            }

            if ($isEnabled) {
                $this->activeColumns[$key] = $config;
            }
        }

        return $this->activeColumns;
    }

    /**
     * Encabezados del Excel dinámicos según campos activos en Item::columns()
     */
    public function headings(): array
    {
        return array_column($this->getActiveColumns(), 'heading');
    }

    /**
     * Mapear cada item a una fila del Excel según columnas activas
     */
    public function map($item): array
    {
        try {
            $row = [];
            foreach ($this->getActiveColumns() as $config) {
                $row[] = ($config['value'])($item);
            }

            return $row;
        } catch (\Exception $e) {
            Log::error("Error exportando item {$item->id}: ".$e->getMessage());

            return array_fill(0, count($this->headings()), '');
        }
    }

    /**
     * Ancho de columnas dinámico
     */
    public function columnWidths(): array
    {
        $widths = [];
        $columnIndex = 1;

        foreach ($this->getActiveColumns() as $config) {
            $columnLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex);
            $widths[$columnLetter] = $config['width'] ?? 20;
            $columnIndex++;
        }

        return $widths;
    }

    /**
     * Limpiar HTML de la descripción o resumen
     */
    private function cleanHtmlDescription(?string $html): string
    {
        if (empty($html)) {
            return '';
        }

        $text = strip_tags($html);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace('/\s+/', ' ', $text);

        return trim($text);
    }

    /**
     * Formatear valores booleanos
     */
    private function formatBoolean($value): string
    {
        if (is_null($value)) {
            return 'No';
        }

        if (is_string($value) || is_numeric($value)) {
            $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
        }

        return $value ? 'Si' : 'No';
    }

    /**
     * Obtener reglas de descuento asociadas
     */
    private function getDiscountRules($item): string
    {
        try {
            $rules = collect();

            // 1. Reglas vinculadas por tags informativos
            $discountTags = $item->tags()
                ->where('tag_type', 'discount_rule')
                ->get();

            foreach ($discountTags as $tag) {
                $rules->push(str_replace('Regla: ', '', $tag->name));
            }

            // 2. Reglas que contienen este item_id en sus condiciones
            $directRules = DiscountRule::where('active', true)->get()->filter(function ($rule) use ($item) {
                $conditions = $rule->conditions ?? [];
                $productIds = $conditions['product_ids'] ?? [];
                $requiredProducts = $conditions['required_products'] ?? [];

                return in_array($item->id, $productIds) || in_array($item->id, $requiredProducts);
            });

            foreach ($directRules as $rule) {
                $rules->push($rule->name);
            }

            return $rules->unique()->filter()->implode(', ');
        } catch (\Exception $e) {
            Log::error("Error obteniendo reglas de descuento para item {$item->id}: ".$e->getMessage());

            return '';
        }
    }

    /**
     * Obtener promociones/tags asociadas
     */
    private function getPromotions($item): string
    {
        try {
            $tags = $item->tags()
                ->where(function ($query) {
                    $query->where('tag_type', 'item')
                        ->orWhereNull('tag_type');
                })
                ->where('tag_type', '!=', 'discount_rule')
                ->get();

            if ($tags->isEmpty()) {
                return '';
            }

            return $tags->pluck('name')->filter()->implode(', ');
        } catch (\Exception $e) {
            Log::error("Error obteniendo promociones/tags para item {$item->id}: ".$e->getMessage());

            return '';
        }
    }

    /**
     * Obtener características (item_features)
     */
    private function getFeatures($item): string
    {
        try {
            $features = $item->features()->get();
            if ($features->isEmpty()) {
                return '';
            }

            return $features->pluck('feature')->filter()->implode(', ');
        } catch (\Exception $e) {
            Log::error("Error obteniendo características para item {$item->id}: ".$e->getMessage());

            return '';
        }
    }

    /**
     * Obtener especificaciones principales (tipo: principal)
     */
    private function getMainSpecifications($item): string
    {
        try {
            $specs = $item->specifications()
                ->where('type', 'principal')
                ->get();

            if ($specs->isEmpty()) {
                return '';
            }

            return $specs->map(function ($spec) {
                $title = trim($spec->title ?? '');
                $desc = trim($spec->description ?? '');

                if ($title !== '' && $desc !== '' && $title !== $desc) {
                    return "{$title}: {$desc}";
                }

                return $title !== '' ? $title : $desc;
            })->filter()->implode(', ');
        } catch (\Exception $e) {
            Log::error("Error obteniendo especificaciones principales para item {$item->id}: ".$e->getMessage());

            return '';
        }
    }

    /**
     * Obtener especificaciones técnicas (tipo: tecnica o cualquier tipo distinto a principal)
     */
    private function getTechnicalSpecifications($item): string
    {
        try {
            $specs = $item->specifications()
                ->where(function ($query) {
                    $query->where('type', 'tecnica')
                        ->orWhere('type', '!=', 'principal')
                        ->orWhereNull('type')
                        ->orWhere('type', '');
                })
                ->get();

            if ($specs->isEmpty()) {
                return '';
            }

            return $specs->map(function ($spec) {
                $title = trim($spec->title ?? '');
                $desc = trim($spec->description ?? '');

                if ($title !== '' && $desc !== '') {
                    return "{$title}: {$desc}";
                }

                return $title !== '' ? $title : $desc;
            })->filter()->implode('/');
        } catch (\Exception $e) {
            Log::error("Error obteniendo especificaciones técnicas para item {$item->id}: ".$e->getMessage());

            return '';
        }
    }

    /**
     * Obtener nombres de atributos dinámicos
     */
    private function getAttributes($item): string
    {
        try {
            $attrs = $item->attributes()->get();

            if ($attrs->isEmpty()) {
                return '';
            }

            return $attrs->pluck('name')->filter()->implode(', ');
        } catch (\Exception $e) {
            Log::error("Error obteniendo atributos para item {$item->id}: ".$e->getMessage());

            return '';
        }
    }

    /**
     * Obtener valores de atributos dinámicos
     */
    private function getAttributeValues($item): string
    {
        try {
            $attrs = $item->attributes()->get();

            if ($attrs->isEmpty()) {
                return '';
            }

            return $attrs->map(function ($attr) {
                return $attr->pivot->value ?? '';
            })->implode(', ');
        } catch (\Exception $e) {
            Log::error("Error obteniendo valores de atributos para item {$item->id}: ".$e->getMessage());

            return '';
        }
    }

    /**
     * Obtener URL absoluta de la imagen principal
     */
    private function getMainImageUrl($item): string
    {
        try {
            $image = $item->image ?? '';
            if (empty($image)) {
                return '';
            }

            if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
                return $image;
            }

            return url("/storage/images/item/{$image}");
        } catch (\Exception $e) {
            Log::error("Error obteniendo URL de imagen principal para item {$item->id}: ".$e->getMessage());

            return '';
        }
    }

    /**
     * Obtener URLs absolutas de la galería de imágenes (separadas por coma)
     */
    private function getGalleryImagesUrl($item): string
    {
        try {
            $images = $item->images()->get();

            if ($images->isEmpty()) {
                return '';
            }

            return $images->map(function ($img) {
                $url = $img->url ?? '';
                if (empty($url)) {
                    return '';
                }

                if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
                    return $url;
                }

                return url("/storage/images/item/{$url}");
            })->filter()->implode(', ');
        } catch (\Exception $e) {
            Log::error("Error obteniendo galería de imágenes para item {$item->id}: ".$e->getMessage());

            return '';
        }
    }

    /**
     * Estilos del Excel
     */
    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size' => 12,
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4'],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }
}
