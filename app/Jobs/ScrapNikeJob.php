<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Exception;

class ScrapNikeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $query;
    protected $storePath;
    protected $cacheKey;

    public function __construct($query, $storePath, $cacheKey)
    {
        $this->query = $query;
        $this->storePath = $storePath;
        $this->cacheKey = $cacheKey;
    }

    public function handle()
    {
        try {
            $command = "node {$this->storePath} " . escapeshellarg($this->query);
            $output = shell_exec($command . ' 2>&1');

            if (!$output) {
                throw new Exception("Error al ejecutar el script de Node.js.");
            }

            $data = json_decode($output, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception("Error al decodificar JSON.");
            }

            // Guardar datos en caché en partes
            Cache::put("{$this->cacheKey}_page_1", array_slice($data, 0, 12), now()->addHour());
            Cache::put("{$this->cacheKey}_all", $data, now()->addHour());
        } catch (Exception $e) {
            Cache::put("{$this->cacheKey}_error", $e->getMessage(), now()->addMinutes(10));
        }
    }
}
