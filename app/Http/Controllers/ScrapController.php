<?php

namespace App\Http\Controllers;

use App\Models\ExchangeRate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Exception;
use Illuminate\Support\Facades\Http;
use Stichoza\GoogleTranslate\GoogleTranslate;
use Illuminate\Support\Facades\Log;

class ScrapController extends BasicController
{



    public function getExchangeRate($currency)
    {
        $today = date('Y-m-d');

        // Verificar si ya existe el tipo de cambio en la base de datos
        $exchangeRate = ExchangeRate::where('date', $today)
            ->where('currency', $currency)
            ->first();

        if ($exchangeRate) {
            return $exchangeRate->rate; // Retornar el tipo de cambio guardado
        }

        // Si no está en la BD, obtenerlo de la API
        $token = "apis-token-13455.UMuwGmnJWOoWR4SHhbdCM3guWeP4iwme";

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => 'https://api.apis.net.pe/v2/sunat/tipo-cambio?date=' . $today,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 2,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => array(
                'Referer: https://apis.net.pe/tipo-de-cambio-sunat-api',
                'Authorization: Bearer ' . $token
            ),
        ]);

        $response = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            return null; // Si hay un error con cURL
        }

        $data = json_decode($response, true);
        //dump($data);

        if (!isset($data['precioVenta'])) {
            return null; // Si la API no responde correctamente
        }

        // Guardar en la base de datos
        $exchangeRate = ExchangeRate::create([
            'currency' => $currency,
            'rate' => $data['precioVenta'],
            'date' => $today
        ]);

        return $exchangeRate->rate;
    }


    public function scrapProviders(Request $request)
    {
        $traductor = new GoogleTranslate('en');
        $traductor->setOptions(['verify' => false]);

        try {
            // Obtener el término de búsqueda y el proveedor
            $query = $request->input('query', 'mujer');
            $proveedor = $request->input('proveedor', 'nike');

            // Determinar la ruta del script y el prefijo de caché según el proveedor
            switch ($proveedor) {
                case 'nike':
                    $dataPath = "nike";
                    $storePath = storage_path('app/scraper/scraper-nike.cjs');
                    break;
                case 'gapfactory':
                    $dataPath = "gapfactory";
                    $storePath = storage_path('app/scraper/scraper-gapfactory.cjs');
                    break;
                case 'invictastores':
                    $dataPath = "invictastores";
                    $storePath = storage_path('app/scraper/scraper-invictastores.cjs');
                    try {
                        $query = $traductor->translate($query);
                    } catch (Exception $e) {
                        // Si la traducción falla, usa la consulta original
                        $query = $request->input('query', 'mujer');
                    }
                    break;
                case 'sephora':
                    $dataPath = "sephora";
                    $storePath = storage_path('app/scraper/scraper-sephora.cjs');
                    break;
                default:
                    $dataPath = "nike";
                    $storePath = storage_path('app/scraper/scraper-nike.cjs');
                    break;
            }

            // Verificar si los datos están en caché
            $cacheKey = "{$dataPath}_products_{$query}";
            $data = Cache::get($cacheKey);

            if (!$data) {
                set_time_limit(60); // Aumenta el tiempo máximo de ejecución

                // Ejecutar Puppeteer con el parámetro
                $command = "node {$storePath} " . escapeshellarg($query);
                $output = shell_exec($command . ' 2>&1');

                if (!$output) {
                    throw new Exception("Error al ejecutar el script de Node.js. Verifica que Node.js esté instalado y que el script funcione correctamente.");
                }

                // Decodificar la salida JSON
                $data = json_decode($output, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception("Error al decodificar JSON: " . json_last_error_msg() . ". Salida del script: " . $output);
                }

                // Guardar los datos en caché durante 1 hora
                Cache::put($cacheKey, $data, now()->addHour());
            }

            // Devolver la respuesta JSON
            return response()->json([
                'status' => 200,
                'message' => 'Operación Correcta. Extraído con Éxito',
                'data' => $data,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error al procesar la solicitud',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function scrap(Request $request)
    {
        $traductor = new GoogleTranslate('en');
        $traductor->setOptions(['verify' => false]);

        try {
            $exchangeRate = 0;
            // Parámetros de búsqueda
            $query = $request->input('query', 'mujer');
            $proveedor = $request->input('proveedor', 'nike');
            $page = max(1, intval($request->input('page', 1))); // Página mínima 1
            $limit = max(1, intval($request->input('limit', 12))); // Mínimo 1 producto por página
            $offset = ($page - 1) * $limit;

            // Determinar el script según el proveedor
            switch ($proveedor) {
                case 'nike':
                    $dataPath = "nike";
                    $storePath = storage_path('app/scraper/scraper-nike.cjs');
                    break;
                case 'gapfactory':
                    $dataPath = "gapfactory";
                    $storePath = storage_path('app/scraper/scraper-gapfactory.cjs');
                    break;
                case 'invictastores':
                    $currency = 'USD';
                    $exchangeRate = $this->getExchangeRate($currency);
                    //dump($exchangeRate);
                    $dataPath = "invictastores";
                    $storePath = storage_path('app/scraper/scraper-invictastores.cjs');
                    try {
                        $query = $traductor->translate($query);
                    } catch (Exception $e) {
                        $query = $request->input('query', 'mujer');
                    }
                    break;
                case 'sephora':
                    $dataPath = "sephora";
                    $storePath = storage_path('app/scraper/scraper-sephora.cjs');
                    break;
                case 'shopsimon':

                    $currency = 'USD';
                    $exchangeRate = $this->getExchangeRate($currency);
                    //dump($exchangeRate);
                    $dataPath = "shopsimon";
                    $storePath = storage_path('app/scraper/scraper-shopsimon.cjs');
                    try {
                        $query = $traductor->translate($query);
                    } catch (Exception $e) {
                        $query = $request->input('query', 'mujer');
                    }

                    break;
                case 'ashford':

                    $currency = 'USD';
                    $exchangeRate = $this->getExchangeRate($currency);
                    //dump($exchangeRate);
                    $dataPath = "ashford";
                    $storePath = storage_path('app/scraper/scraper-ashford.cjs');
                    try {
                        $query = $traductor->translate($query);
                    } catch (Exception $e) {
                        $query = $request->input('query', 'mujer');
                    }

                    break;

                default:
                    $dataPath = "nike";
                    $storePath = storage_path('app/scraper/scraper-nike.cjs');
                    break;
            }

            // Clave de caché con paginación
            $cacheKey = "{$dataPath}_products_{$query}_page_{$page}_limit_{$limit}";
            $data = Cache::get($cacheKey);

            if (!$data) {
                set_time_limit(60); // Evitar timeout en la ejecución

                // Ejecutar Puppeteer con paginación
                $command = "node {$storePath} " . escapeshellarg($query) . " " . escapeshellarg($offset) . " " . escapeshellarg($limit) . " " . escapeshellarg($exchangeRate) . " " . escapeshellarg($page);
                // dump($command);


                $output = shell_exec($command . ' 2>&1');
                Log::info($output);
                if (!$output) {
                    Log::info("Error al ejecutar el script de Node.js.");
                }

                // Decodificar JSON de la salida
                $data = json_decode($output, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::info("Error JSON: " . json_last_error_msg() . ". Salida: " . $output);
                }

                // Guardar en caché (1 hora)
                Cache::put($cacheKey, $data, now()->addHour());
            }

            // Retornar datos con paginación
            return response()->json([
                'status' => 200,
                'message' => 'Datos extraídos correctamente',
                'data' => $data,
                'page' => $page,
                'limit' => $limit
            ]);
        } catch (Exception $e) {
            Log::info("Error: " . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error en el scraping',
                'error' => $e->getMessage(),
            ], 500);
        }
    }




    /* public function scrapShopSimon(Request $request)
    {
        $traductor = new GoogleTranslate('en');
        $traductor->setOptions(['verify' => false]);

        try {
            $exchangeRate = 0;
            // Parámetros de búsqueda
            $query = $request->input('query', 'mujer');
            $proveedor = $request->input('proveedor', 'nike');
            $page = max(1, intval($request->input('page', 1))); // Página mínima 1
            $limit = max(1, intval($request->input('limit', 12))); // Mínimo 1 producto por página
            $offset = ($page - 1) * $limit;

            // Determinar el script según el proveedor

            $currency = 'USD';
            $exchangeRate = $this->getExchangeRate($currency);
            $dataPath = "shopsimon";
            $storePath = storage_path('app/scraper/scraper-shopsimon.cjs');
            try {
                $query = $traductor->translate($query);
            } catch (Exception $e) {
                $query = $request->input('query', 'mujer');
            }

            // Clave de caché con paginación
            $cacheKey = "{$dataPath}_products_{$query}_page_{$page}_limit_{$limit}";
            $data = Cache::get($cacheKey);

            if (!$data) {
                set_time_limit(60); // Evitar timeout en la ejecución

                // Ejecutar Puppeteer con paginación
                $command = "node {$storePath} " . escapeshellarg($query) . " " . escapeshellarg($offset) . " " . escapeshellarg($limit) . " " . escapeshellarg($exchangeRate) . " " . escapeshellarg($page);
//dump($command);


                $output = shell_exec($command . ' 2>&1');
//dump($output);
                if (!$output) {
                    Log::info("Error al ejecutar el script de Node.js.");
                }

                // Decodificar JSON de la salida
                $data = json_decode($output, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::info("Error JSON: " . json_last_error_msg() . ". Salida: " . $output);
                }

                // Guardar en caché (1 hora)
                Cache::put($cacheKey, $data, now()->addHour());
            }

            // Retornar datos con paginación
            return response()->json([
                'status' => 200,
                'message' => 'Datos extraídos correctamente',
                'data' => $data,
                'page' => $page,
                'limit' => $limit
            ]);
        } catch (Exception $e) {
            Log::info("Error: " . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error en el scraping',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    function buildNikeUrl($filters, $query = 'mujer', $offset = 0, $limit = 12)
    {
        $baseUrl = "https://www.nike.com.pe/search";
        $pathSegments = [];

        // 🔹 Función para limpiar texto (minúsculas, sin tildes, sin espacios)
        $limpiarTexto = function ($texto) {
            $texto = strtolower($texto); // Convertir a minúsculas
            $texto = str_replace(
                ['á', 'é', 'í', 'ó', 'ú', 'ñ'],
                ['a', 'e', 'i', 'o', 'u', 'n'],
                $texto
            ); // Quitar tildes y ñ
            return str_replace(' ', '_', $texto); // Reemplazar espacios por "_"
        };


        if (!empty($filters['Deporte'])) {
            $deporteLimpio = array_map($limpiarTexto, $filters['Deporte']);
            $pathSegments[] = implode("_", $deporteLimpio);
        }

        if (!empty($filters['Género'])) {
            $pathSegments[] = implode("_", array_map('strtolower', $filters['Género']));
        }

        if (!empty($filters['Línea'])) {
            $pathSegments[] = implode("_", array_map('strtolower', $filters['Línea']));
        }

        if (!empty($filters['Ícono'])) {
            $pathSegments[] = implode("_", array_map('strtolower', $filters['Ícono']));
        }

        if (!empty($filters['Color'])) {
            $pathSegments[] = implode("_", array_map('strtolower', $filters['Color']));
        }

        $path = !empty($pathSegments) ? "/" . implode("/", $pathSegments) : "";

        // 🟢 Construir los parámetros en el ORDEN CORRECTO
        $queryParts = [];

        // 1️⃣ Parámetro de búsqueda
        $queryParts[] = "q=" . urlencode($query);

        // 2️⃣ Paginación y límite
        $queryParts[] = "start={$offset}";
        $queryParts[] = "sz={$limit}";

        // 3️⃣ Filtros de precios
        if (!empty($filters['Precio'])) {
            $precios = [];
            foreach ($filters['Precio'] as $rango) {
                preg_match('/S\/\.(\d+\.\d+)\s*-\s*S\/\.(\d+\.\d+)/', $rango, $matches);
                if ($matches) {
                    $precios[] = [(float)$matches[1], (float)$matches[2]];
                }
            }
            if (!empty($precios)) {
                $pmin = min(array_column($precios, 0));
                $pmax = max(array_column($precios, 1));
                $queryParts[] = "pmin=" . $pmin;
                $queryParts[] = "pmax=" . $pmax;
            }
        }

        // 4️⃣ Filtro de tallas (si existe)
        if (!empty($filters['Talla'])) {
            $queryParts[] = "prefn1=size";
            $queryParts[] = "prefv1=" . strtolower(implode("|", $filters['Talla']));
        }

        // 📌 Convertir a string de URL
        $queryString = implode("&", $queryParts);

        // 🔹 Retornar URL final con el orden correcto
        return "{$baseUrl}{$path}?{$queryString}";
    }




    public function scrapFilter(Request $request)
    {
        $traductor = new GoogleTranslate('en');
        $traductor->setOptions(['verify' => false]);

        try {
            $exchangeRate = 0;

            // 🔹 Parámetros de búsqueda
            $query = $request->input('query', 'mujer');
            $proveedor = $request->input('proveedor', 'nike');
            $filters = $request->input('filters', []); // Recibir los filtros como array
//dump($filters);
            $page = max(1, intval($request->input('page', 1))); // Página mínima 1
            $limit = max(1, intval($request->input('limit', 12))); // Mínimo 1 producto por página
            $offset = ($page - 1) * $limit;

            // 🔹 Construir la URL con los filtros
            $nikeUrl = $this->buildNikeUrl($filters, $query, $offset, $limit);
//dump($nikeUrl);

            $dataPath = "nike";
            $storePath = storage_path('app/scraper/scraper-nike.cjs');
            $data = [];
            // 🔹 Clave de caché con paginación
            // $cacheKey = "{$dataPath}_products_{$query}_page_{$page}_limit_{$limit}";
            // $data = Cache::get($cacheKey);

            if (!$data) {
                set_time_limit(60); // Evitar timeout en la ejecución

                // 🔹 Ejecutar Puppeteer con la URL generada
                $command = "node {$storePath} " . escapeshellarg($nikeUrl);
//dump($command);

                $output = shell_exec($command . ' 2>&1');
//dump($output);
                if (!$output) {
                    Log::info("Error al ejecutar el script de Node.js.");
                }

                // 🔹 Decodificar JSON de la salida
                $data = json_decode($output, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::info("Error JSON: " . json_last_error_msg() . ". Salida: " . $output);
                }

                // 🔹 Guardar en caché (1 hora)
                // Cache::put($cacheKey, $data, now()->addHour());
            }

            // 🔹 Retornar datos con paginación
            return response()->json([
                'status' => 200,
                'message' => 'Datos extraídos correctamente',
                'data' => $data['products'],
                'filters' => $data['filters'],
                'page' => $page,
                'limit' => $limit
            ]);
        } catch (Exception $e) {
            Log::info("Error: " . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error en el scraping',
                'error' => $e->getMessage(),
            ], 500);
        }
    } */
}
