<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class OptimizeImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:optimize 
                            {--folder= : Carpeta específica a optimizar (ej. slider, item, banner)} 
                            {--quality=82 : Calidad de compresión (1-100, defecto: 82)} 
                            {--to-webp : Convertir formato a WebP (opcional; por defecto mantiene el formato original para no tocar la BD)} 
                            {--force : Ejecutar sin pedir confirmación} 
                            {--dry-run : Simular la optimización sin modificar archivos ni base de datos}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimiza imágenes in-situ (conservando extensiones y referencias de BD por defecto) o convirtiendo a WebP opcionalmente';

    /**
     * Mapeo de carpetas, tamaños máximos recomendados para web y modelos de BD asociados.
     */
    protected $config = [
        'slider' => [
            'max_width' => 1920,
            'max_width_mobile' => 800,
            'quality' => 85, // Calidad superior para sliders para máxima nitidez
            'models' => [
                ['class' => \App\Models\Slider::class, 'columns' => ['image', 'bg_image', 'bg_image_mobile']],
            ]
        ],
        'banner' => [
            'max_width' => 1920,
            'quality' => 85,
            'models' => [
                ['class' => \App\Models\Banner::class, 'columns' => ['image', 'background']],
            ]
        ],
        'item' => [
            'max_width' => 1200,
            'quality' => 82,
            'models' => [
                ['class' => \App\Models\Item::class, 'columns' => ['image', 'banner']],
                ['class' => \App\Models\ItemImage::class, 'columns' => ['url']],
            ]
        ],
        'category' => [
            'max_width' => 1000,
            'quality' => 80,
            'models' => [
                ['class' => \App\Models\Category::class, 'columns' => ['image', 'banner', 'banners']],
            ]
        ],
        'subcategory' => [
            'max_width' => 1000,
            'quality' => 80,
            'models' => [
                ['class' => \App\Models\SubCategory::class, 'columns' => ['image', 'banners']],
            ]
        ],
        'collection' => [
            'max_width' => 1200,
            'quality' => 82,
            'models' => [
                ['class' => \App\Models\Collection::class, 'columns' => ['image']],
            ]
        ],
        'brand' => [
            'max_width' => 600,
            'quality' => 82,
            'models' => [
                ['class' => \App\Models\Brand::class, 'columns' => ['image']],
            ]
        ],
        'post' => [
            'max_width' => 1200,
            'quality' => 82,
            'models' => [
                ['class' => \App\Models\Post::class, 'columns' => ['image']],
            ]
        ],
        'store' => [
            'max_width' => 1200,
            'quality' => 80,
            'models' => [
                ['class' => \App\Models\Store::class, 'columns' => ['image', 'gallery']],
            ]
        ],
        'testimony' => [
            'max_width' => 500,
            'quality' => 80,
            'models' => [
                ['class' => \App\Models\Testimony::class, 'columns' => ['image']],
            ]
        ],
        'service' => [
            'max_width' => 1200,
            'quality' => 82,
            'models' => [
                ['class' => \App\Models\Service::class, 'columns' => ['image', 'background_image']],
                ['class' => \App\Models\ServiceImage::class, 'columns' => ['image']],
            ]
        ],
        'aboutus' => [
            'max_width' => 1200,
            'quality' => 82,
            'models' => [
                ['class' => \App\Models\AboutUs::class, 'columns' => ['image']],
            ]
        ],
        'benefit' => [
            'max_width' => 600,
            'quality' => 80,
            'models' => [
                ['class' => \App\Models\Benefit::class, 'columns' => ['image']],
            ]
        ],
        'strength' => [
            'max_width' => 600,
            'quality' => 80,
            'models' => [
                ['class' => \App\Models\Strength::class, 'columns' => ['image']],
            ]
        ],
        'innovation' => [
            'max_width' => 1000,
            'quality' => 82,
            'models' => [
                ['class' => \App\Models\Innovation::class, 'columns' => ['image']],
            ]
        ],
        'partner' => [
            'max_width' => 600,
            'quality' => 80,
            'models' => [
                ['class' => \App\Models\Partner::class, 'columns' => ['image']],
            ]
        ],
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $folderOption = $this->option('folder');
        $defaultQuality = (int) $this->option('quality') ?: 82;
        $toWebp = (bool) $this->option('to-webp');
        $isDryRun = $this->option('dry-run');
        $force = $this->option('force');

        $this->info("=================================================");
        $this->info("🚀 Optimizador de Imágenes Web (In-situ / Seguro)");
        $this->info("=================================================");

        if ($toWebp) {
            $this->warn("MODO CONVERSIÓN (--to-webp): Los formatos se convertirán a .webp y se actualizará la base de datos.");
        } else {
            $this->info("MODO CONSERVACIÓN (Por defecto): Se mantiene el formato original (.jpg, .png, .webp).");
            $this->info("🛡️ La base de datos y nombres de archivo NO se tocan; solo se reduce drásticamente el peso.");
        }

        if ($isDryRun) {
            $this->warn("MODO SIMULACIÓN (--dry-run): No se modificará ningún archivo en disco.");
        }

        $foldersToProcess = [];
        if ($folderOption) {
            if (!isset($this->config[$folderOption])) {
                $this->error("La carpeta '{$folderOption}' no está configurada. Opciones válidas: " . implode(', ', array_keys($this->config)));
                return 1;
            }
            $foldersToProcess[$folderOption] = $this->config[$folderOption];
        } else {
            $foldersToProcess = $this->config;
        }

        if (!$force && !$isDryRun) {
            if (!$this->confirm("¿Deseas proceder con la optimización de: " . implode(', ', array_keys($foldersToProcess)) . "?", true)) {
                $this->info("Operación cancelada por el usuario.");
                return 0;
            }
        }

        $totalInitialBytes = 0;
        $totalFinalBytes = 0;
        $totalOptimizedCount = 0;
        $totalSkippedCount = 0;

        foreach ($foldersToProcess as $directory => $configData) {
            $relativePath = "images/{$directory}";
            $fullDir = storage_path("app/{$relativePath}");

            if (!is_dir($fullDir)) {
                $this->line("Carpeta no encontrada: <comment>{$relativePath}</comment>. Saltando.");
                continue;
            }

            $this->line("");
            $this->info("📂 Procesando carpeta: <fg=cyan>{$directory}</>...");

            $files = glob("{$fullDir}/*.*");
            if (empty($files)) {
                $this->line("   No hay archivos en esta carpeta.");
                continue;
            }

            $maxWidth = $configData['max_width'] ?? 1200;
            $quality = $this->option('quality') ? (int) $this->option('quality') : ($configData['quality'] ?? $defaultQuality);
            $conversions = []; // [oldName => newName]

            $bar = $this->output->createProgressBar(count($files));
            $bar->start();

            foreach ($files as $filePath) {
                $fileName = basename($filePath);
                $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

                // Solo procesamos png, jpg, jpeg o webp
                if (!in_array($ext, ['png', 'jpg', 'jpeg', 'webp'])) {
                    $bar->advance();
                    $totalSkippedCount++;
                    continue;
                }

                $originalSize = filesize($filePath);
                $isMobile = str_contains(strtolower($fileName), 'mobile') || str_contains(strtolower($fileName), 'celular');
                $targetWidth = ($isMobile && isset($configData['max_width_mobile'])) ? $configData['max_width_mobile'] : $maxWidth;

                $result = $this->optimizeImage($filePath, $ext, $targetWidth, $quality, $isDryRun, $toWebp);

                if ($result && $result['optimized']) {
                    $totalOptimizedCount++;
                    $totalInitialBytes += $originalSize;
                    $totalFinalBytes += $result['final_size'];

                    if (isset($result['new_filename']) && $result['new_filename'] !== $fileName) {
                        $conversions[$fileName] = $result['new_filename'];
                    }
                } else {
                    $totalSkippedCount++;
                }

                $bar->advance();
            }

            $bar->finish();
            $this->line("");

            // Actualizar referencias en BD solo si se convirtió a webp
            if ($toWebp && !empty($conversions) && !$isDryRun) {
                $this->updateDatabaseReferences($configData['models'] ?? [], $conversions);
            }
        }

        $this->line("");
        $this->info("=================================================");
        $this->info("🎉 Resumen de Optimización");
        $this->info("=================================================");
        $this->line("Imágenes optimizadas: <fg=green>{$totalOptimizedCount}</>");
        $this->line("Imágenes omitidas (ya óptimas): {$totalSkippedCount}");

        if ($totalInitialBytes > 0) {
            $savedBytes = $totalInitialBytes - $totalFinalBytes;
            $savedMB = round($savedBytes / (1024 * 1024), 2);
            $initialMB = round($totalInitialBytes / (1024 * 1024), 2);
            $finalMB = round($totalFinalBytes / (1024 * 1024), 2);
            $percent = round(($savedBytes / $totalInitialBytes) * 100, 1);

            $this->line("Peso inicial: <fg=yellow>{$initialMB} MB</>");
            $this->line("Peso final:   <fg=green>{$finalMB} MB</>");
            $this->info("Ahorro total: <fg=green>{$savedMB} MB ({$percent}% menos peso)</>");
        } else {
            $this->info("No se encontraron imágenes que requirieran reducción de peso.");
        }

        $this->info("=================================================");
        return 0;
    }

    /**
     * Procesa y optimiza un archivo individual.
     */
    protected function optimizeImage($filePath, $ext, $maxWidth, $quality, $isDryRun, $toWebp)
    {
        $originalSize = filesize($filePath);
        $imgInfo = @getimagesize($filePath);

        if (!$imgInfo) {
            return ['optimized' => false];
        }

        $origWidth = $imgInfo[0];
        $origHeight = $imgInfo[1];
        $mime = $imgInfo['mime'];

        // Si ya es webp o jpg ligero y su ancho está dentro del límite, no tocar
        if ($originalSize <= 120 * 1024 && $origWidth <= $maxWidth) {
            return ['optimized' => false];
        }

        // Cargar recurso GD
        $sourceImage = null;
        switch ($mime) {
            case 'image/jpeg':
            case 'image/jpg':
                if (function_exists('imagecreatefromjpeg')) {
                    $sourceImage = @imagecreatefromjpeg($filePath);
                }
                break;
            case 'image/png':
                if (function_exists('imagecreatefrompng')) {
                    $sourceImage = @imagecreatefrompng($filePath);
                    if ($sourceImage) {
                        imagealphablending($sourceImage, false);
                        imagesavealpha($sourceImage, true);
                    }
                }
                break;
            case 'image/webp':
                if (function_exists('imagecreatefromwebp')) {
                    $sourceImage = @imagecreatefromwebp($filePath);
                }
                break;
        }

        if (!$sourceImage) {
            return ['optimized' => false];
        }

        // Convertir paleta a True Color si es necesario
        if (function_exists('imagepalettetotruecolor') && !imageistruecolor($sourceImage)) {
            imagepalettetotruecolor($sourceImage);
        }

        // Redimensionar si excede el ancho máximo (manteniendo el aspect ratio exacto)
        if ($origWidth > $maxWidth && $maxWidth > 0) {
            $newWidth = $maxWidth;
            $newHeight = (int) round($origHeight * ($newWidth / $origWidth));

            $scaled = imagecreatetruecolor($newWidth, $newHeight);
            if ($scaled) {
                imagealphablending($scaled, false);
                imagesavealpha($scaled, true);
                imagecopyresampled($scaled, $sourceImage, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
                imagedestroy($sourceImage);
                $sourceImage = $scaled;
            }
        }

        $tempOut = tempnam(sys_get_temp_dir(), 'opt_img_');

        // Determinar formato de salida
        if ($toWebp && function_exists('imagewebp')) {
            $saved = @imagewebp($sourceImage, $tempOut, $quality);
            $outExt = 'webp';
        } else {
            // MANTENER FORMATO ORIGINAL:
            switch ($mime) {
                case 'image/jpeg':
                case 'image/jpg':
                    $saved = @imagejpeg($sourceImage, $tempOut, $quality);
                    $outExt = $ext;
                    break;
                case 'image/png':
                    // Compresión PNG (nivel 8 de 9)
                    $saved = @imagepng($sourceImage, $tempOut, 8);
                    $outExt = 'png';
                    break;
                case 'image/webp':
                    $saved = @imagewebp($sourceImage, $tempOut, $quality);
                    $outExt = 'webp';
                    break;
                default:
                    $saved = false;
            }
        }

        imagedestroy($sourceImage);

        if (!$saved || !file_exists($tempOut)) {
            @unlink($tempOut);
            return ['optimized' => false];
        }

        $newSize = filesize($tempOut);

        // Si la optimización no redujo el tamaño y no hubo redimensión, descartar
        if ($newSize >= $originalSize && $origWidth <= $maxWidth) {
            @unlink($tempOut);
            return ['optimized' => false];
        }

        $dirName = dirname($filePath);
        $fileNameNoExt = pathinfo($filePath, PATHINFO_FILENAME);
        $newFilename = ($toWebp) ? "{$fileNameNoExt}.webp" : basename($filePath);
        $finalPath = "{$dirName}/{$newFilename}";

        if ($isDryRun) {
            @unlink($tempOut);
            return [
                'optimized' => true,
                'final_size' => $newSize,
                'new_filename' => $newFilename
            ];
        }

        // Guardar archivo final
        copy($tempOut, $finalPath);
        @unlink($tempOut);

        // Si se convirtió a webp y la extensión cambió, borrar el archivo viejo
        if ($toWebp && $outExt !== $ext && file_exists($filePath)) {
            @unlink($filePath);
        }

        return [
            'optimized' => true,
            'final_size' => $newSize,
            'new_filename' => $newFilename
        ];
    }

    /**
     * Actualiza las tablas de BD que apuntan a nombres de archivos antiguos (solo si se usa --to-webp).
     */
    protected function updateDatabaseReferences(array $models, array $conversions)
    {
        if (empty($models) || empty($conversions)) {
            return;
        }

        foreach ($models as $modelConfig) {
            $class = $modelConfig['class'];
            $columns = $modelConfig['columns'];

            if (!class_exists($class)) {
                continue;
            }

            $modelInstance = new $class;
            $table = $modelInstance->getTable();
            $casts = $modelInstance->getCasts();

            foreach ($columns as $column) {
                if (!Schema::hasColumn($table, $column)) {
                    continue;
                }

                $isJson = in_array($casts[$column] ?? null, ['array', 'json', 'object', 'collection']);

                if ($isJson) {
                    $records = DB::table($table)->whereNotNull($column)->get(['id', $column]);
                    foreach ($records as $record) {
                        $raw = $record->$column;
                        $data = is_string($raw) ? json_decode($raw, true) : $raw;
                        $modified = false;

                        if (is_array($data)) {
                            array_walk_recursive($data, function (&$val) use ($conversions, &$modified) {
                                if (is_string($val)) {
                                    $base = basename($val);
                                    if (isset($conversions[$base])) {
                                        $val = str_replace($base, $conversions[$base], $val);
                                        $modified = true;
                                    }
                                }
                            });
                            if ($modified) {
                                DB::table($table)->where('id', $record->id)->update([
                                    $column => json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
                                ]);
                            }
                        }
                    }
                } else {
                    foreach ($conversions as $oldName => $newName) {
                        DB::table($table)
                            ->where($column, $oldName)
                            ->update([$column => $newName]);
                    }
                }
            }
        }
    }
}
