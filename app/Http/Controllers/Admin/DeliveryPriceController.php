<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Classes\dxResponse;
use App\Models\DeliveryPrice;
use App\Models\TypeDelivery;
use App\Exports\DeliveryPriceExport;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use Maatwebsite\Excel\Facades\Excel;
use SoDe\Extend\Response;
use SoDe\Extend\Text;

class DeliveryPriceController extends BasicController
{
    public $model = DeliveryPrice::class;
    public $reactView = 'Admin/DeliveryPricesType';

    public function setReactViewProperties(Request $request)
    {
        $ubigeo = JSON::parse(File::get('../storage/app/utils/ubigeo.json'));
        $user = auth()->user();
        $hasRootRole = $user ? $user->hasRole('Root') : false;
        $deliveryTypes = TypeDelivery::all();
        
        return [
            'ubigeo' => $ubigeo,
            'hasRootRole' => $hasRootRole,
            'deliveryTypes' => $deliveryTypes
        ];
    }

    /**
     * Override paginate to handle virtual column filter for active_options_search
     */
    public function paginate(Request $request): HttpResponse|ResponseFactory
    {
        // Interceptar y transformar filtros de columnas virtuales
        if ($request->filter) {
            $request->merge([
                'filter' => $this->transformVirtualFilters($request->filter)
            ]);
        }

        // Llamar al método padre
        return parent::paginate($request);
    }

    /**
     * Transform virtual column filters into real database column filters
     */
    protected function transformVirtualFilters($filter)
    {
        // Si el filtro no es un array, retornar sin cambios
        if (!is_array($filter)) {
            return $filter;
        }

        // Si es un filtro simple [field, operator, value]
        if (count($filter) === 3 && !is_array($filter[0])) {
            if ($filter[0] === 'active_options_search') {
                return $this->convertActiveOptionsFilter($filter[2]);
            }
            return $filter;
        }

        // Si es un filtro compuesto (con 'and' u 'or')
        $transformed = [];
        foreach ($filter as $item) {
            if (is_array($item)) {
                $transformed[] = $this->transformVirtualFilters($item);
            } else {
                $transformed[] = $item;
            }
        }

        return $transformed;
    }

    /**
     * Convert active_options_search filter into multiple OR conditions
     */
    protected function convertActiveOptionsFilter($searchValue)
    {
        $conditions = [];

        // Buscar "Estándar" o "Estandar" (price > 0 AND NOT is_free)
        if (stripos($searchValue, 'estand') !== false || stripos($searchValue, 'standar') !== false) {
            $conditions[] = [
                ['price', '>', 0],
                'and',
                ['is_free', '=', false]
            ];
        }

        // Buscar "Express"
        if (stripos($searchValue, 'express') !== false || stripos($searchValue, 'exp') !== false) {
            $conditions[] = [
                ['is_express', '=', true],
                'or',
                ['express_price', '>', 0]
            ];
        }

        // Buscar "Gratis" o "Free"
        if (stripos($searchValue, 'gratis') !== false || stripos($searchValue, 'free') !== false) {
            $conditions[] = ['is_free', '=', true];
        }

        // Buscar "Agencia"
        if (stripos($searchValue, 'agencia') !== false || stripos($searchValue, 'age') !== false) {
            $conditions[] = ['is_agency', '=', true];
        }

        // Buscar "Tienda" o "Store"
        if (stripos($searchValue, 'tienda') !== false || stripos($searchValue, 'store') !== false) {
            $conditions[] = ['is_store_pickup', '=', true];
        }

        // Si no se encontró ninguna condición, retornar un filtro que no coincida con nada
        if (empty($conditions)) {
            return ['id', '=', -1]; // No match
        }

        // Si solo hay una condición, retornarla directamente
        if (count($conditions) === 1) {
            return $conditions[0];
        }

        // Si hay múltiples condiciones, combinarlas con OR
        $result = [];
        foreach ($conditions as $condition) {
            $result[] = $condition;
            $result[] = 'or';
        }
        // Remover el último 'or'
        array_pop($result);

        return $result;
    }

    public function beforeSave(Request $request)
    {
        $body = $request->all();
        $found = $this->model::where('ubigeo', $body['ubigeo'])->first();

        if ($found) {
            $body['id'] = $found->id;
        }

        if ($request->has('is_free') && $request->input('is_free')) {
            $freeType = TypeDelivery::where('slug', 'envio-gratis')->first();
        } else if ($request->has('is_agency') && $request->input('is_agency')) {
            $freeType = TypeDelivery::where('slug', 'envio-agencia')->first();
        } else {
            $freeType = TypeDelivery::where('slug', 'delivery-normal')->first();
        }

        if ($freeType) {
            $body['type_id'] = $freeType->id;
        }

        // Manejar selected_stores
        if ($request->has('selected_stores')) {
            $selectedStores = $request->input('selected_stores');
            // Si selected_stores es null o está vacío, significa "todas las tiendas"
            $body['selected_stores'] = $selectedStores;
        }

        return $body;
    }


    private $fieldMappings = [];

    /**
     * Configuración de mapeo de campos por defecto
     * Permite usar diferentes nombres de columnas para el mismo campo
     */
    private function getDefaultFieldMappings(): array
    {
        return [
            'ubigeo' => ['ubigeo', 'ubigeo_reniec', 'codigo_ubigeo', 'reniec', 'Ubigeo (RENIEC)', 'Ubigeo'],
            'nombre' => ['nombre_distrito', 'nombre', 'distrito', 'Nombre Distrito'],
            'price' => ['precio_estandar', 'precio_standar', 'precio_normal', 'precio', 'price', 'Precio Estándar (S/)', 'Precio Estandar'],
            'express_price' => ['precio_express', 'express_price', 'precio_exp', 'Precio Express (S/)', 'Precio Express'],
            'is_free' => ['es_gratis', 'is_free', 'gratis', 'free', '¿Es Gratis?', 'Es Gratis', '¿Envío Gratis?'],
            'is_agency' => ['es_agencia', 'is_agency', 'agencia', 'agency', '¿Es Agencia?', 'Es Agencia', '¿Recojo en Agencia?', 'Recojo en Agencia', '¿Envío en Agencia?'],
            'agency_price' => ['precio_agencia', 'agency_price', 'Precio Agencia (S/)', 'Precio Agencia'],
            'agency_payment_on_delivery' => ['pago_destino_agencia', 'pago_en_destino', 'contra_entrega_agencia', 'agency_payment_on_delivery', '¿Pago en Destino?', 'Pago en Destino', 'Contra Entrega'],
            'is_store_pickup' => ['retiro_tienda', 'is_store_pickup', 'tienda', 'pickup', 'store_pickup', '¿Retiro Tienda?', '¿Recojo en Tienda?', 'Recojo en Tienda','¿Retiro en Tienda?','Retiro en Tienda'],
        ];
    }

    /**
     * Obtener valor de campo usando mapeos alternativos
     */
    private function getFieldValue(array $row, string $fieldKey, $default = null)
    {
        $possibleKeys = $this->fieldMappings[$fieldKey] ?? [$fieldKey];
        
        foreach ($possibleKeys as $key) {
            if (array_key_exists($key, $row) && !is_null($row[$key]) && trim(strval($row[$key])) !== '') {
                return trim(strval($row[$key]));
            }
        }
        
        return $default;
    }

    /**
     * Verificar si existe al menos uno de los campos mapeados
     */
    private function hasField(array $row, string $fieldKey): bool
    {
        $possibleKeys = $this->fieldMappings[$fieldKey] ?? [$fieldKey];
        
        foreach ($possibleKeys as $key) {
            if (array_key_exists($key, $row) && !is_null($row[$key]) && trim(strval($row[$key])) !== '') {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Obtener valor numérico de un campo usando mapeos
     */
    private function getNumericValue(array $row, string $fieldKey, $default = null)
    {
        $value = $this->getFieldValue($row, $fieldKey);
        
        if (is_null($value) || $value === '') {
            return $default;
        }
        
        // Limpiar el valor (remover espacios, comas, símbolos de moneda)
        $cleanValue = preg_replace('/[^\d.-]/', '', $value);
        
        return is_numeric($cleanValue) ? (float)$cleanValue : $default;
    }

    /**
     * Obtener valor booleano de un campo usando mapeos
     */
    private function getBooleanValue(array $row, string $fieldKey, $default = false): bool
    {
        $value = $this->getFieldValue($row, $fieldKey);
        
        if (is_null($value) || $value === '') {
            return $default;
        }
        
        $value = strtolower(trim($value));
        
        // Valores que se consideran true
        $trueValues = ['1', 'true', 'verdadero', 'si', 'sí', 'yes', 'y', 'activo', 'active'];
        // Valores que se consideran false
        $falseValues = ['0', 'false', 'falso', 'no', 'n', 'inactivo', 'inactive'];
        
        if (in_array($value, $trueValues)) {
            return true;
        }
        
        if (in_array($value, $falseValues)) {
            return false;
        }
        
        return $default;
    }

    public function massive(Request $request)
    {
        $request->validate([
            'excel' => 'required|file|mimes:xlsx,csv',
        ]);

        DB::beginTransaction();
        $response = Response::simpleTryCatch(function () use ($request) {
            $file = $request->file('excel');
            $ubigeoData = JSON::parse(File::get('../storage/app/utils/ubigeo.json'));

            // Inicializar mapeos de campos
            $this->fieldMappings = $this->getDefaultFieldMappings();

            $data = Excel::toArray([], $file)[0];
            $result = [];

            foreach ($data as $index => $row) {
                // Saltar fila de encabezados o instrucciones
                if ($index === 0 || $this->isRowEmpty($row)) {
                    continue;
                }

                // Obtener y validar ubigeo
                $ubigeo = $this->getFieldValue($row, 'ubigeo');
                if (!$ubigeo || !is_numeric($ubigeo)) {
                    continue;
                }
            
                // Obtener valores usando nombres de campo
                $price = $this->getNumericValue($row, 'price', 0);
                $express_price = $this->getNumericValue($row, 'express_price', 0);
                $is_free = $this->getBooleanValue($row, 'is_free', false);
                $is_agency = $this->getBooleanValue($row, 'is_agency', false);
                $agency_price = $this->getNumericValue($row, 'agency_price', 0);
                $agency_payment_on_delivery = $this->getBooleanValue($row, 'agency_payment_on_delivery', false);
                $is_store_pickup = $this->getBooleanValue($row, 'is_store_pickup', false);

                // Determinar is_express basado en express_price
                $is_express = $express_price > 0;

                // Determinar type_id basado en prioridad
                $type_id = $this->determineTypeId($is_free, $is_agency, $is_express);

                // Buscar ubigeo en datos
                $ubigeoObject = collect($ubigeoData)->firstWhere('reniec', $ubigeo);
                if (!$ubigeoObject) {
                    Log::warning("Fila {$index}: Ubigeo {$ubigeo} no encontrado en ubigeo.json");
                    continue;
                }

                // Generar nombre formateado
                $name = Text::toTitleCase(
                    "{$ubigeoObject['distrito']}, {$ubigeoObject['provincia']} - {$ubigeoObject['departamento']}"
                );

                // Crear o actualizar registro
                $deliveryPrice = $this->model::updateOrCreate(
                    ['ubigeo' => $ubigeo],
                    [
                        'name' => $name,
                        'price' => $price,
                        'is_free' => $is_free,
                        'is_express' => $is_express,
                        'express_price' => $express_price,
                        'is_agency' => $is_agency,
                        'agency_price' => $agency_price,
                        'agency_payment_on_delivery' => $agency_payment_on_delivery,
                        'is_store_pickup' => $is_store_pickup,
                        'type_id' => $type_id,
                    ]
                );

                $result[] = $deliveryPrice;
            }
            
            DB::commit();
            return $result;
        }, function () {
            DB::rollBack();
        });

        return response($response->toArray(), $response->status);
    }

    /**
     * Verificar si una fila está vacía
     */
    private function isRowEmpty(array $row): bool
    {
        // Si no hay ubigeo, la fila está vacía
        if (!$this->hasField($row, 'ubigeo')) {
            return true;
        }

        // Verificar si todas las columnas están vacías
        foreach ($row as $value) {
            if (!is_null($value) && trim(strval($value)) !== '') {
                return false;
            }
        }

        return true;
    }

    /**
     * Determinar type_id basado en las opciones activas (prioridad)
     */
    private function determineTypeId(bool $is_free, bool $is_agency, bool $is_express, bool $is_store_pickup = false): ?string
    {
        // Prioridad 1: Retiro en tienda
        if ($is_store_pickup) {
            $type = TypeDelivery::where('slug', 'retiro-en-tienda')->orWhere('slug', 'retiro-tienda')->first();
            if ($type) return $type->id;
        }

        // Prioridad 2: Envío gratis
        if ($is_free) {
            $type = TypeDelivery::where('slug', 'envio-gratis')->first();
            if ($type) return $type->id;
        }

        // Prioridad 3: Recojo en agencia
        if ($is_agency) {
            $type = TypeDelivery::where('slug', 'delivery-agencia')->first();
            if ($type) return $type->id;
        }

        // Prioridad 4: Delivery express
        if ($is_express) {
            $type = TypeDelivery::where('slug', 'delivery-express')->first();
            if ($type) return $type->id;
        }

        // Por defecto: Delivery normal / estándar
        $type = TypeDelivery::where('slug', 'delivery-normal')->orWhere('slug', 'delivery-estandar')->first();
        return $type ? $type->id : null;
    }

    /**
     * Validate and update ubigeo names from ubigeo.json
     */
    public function validateReniec(Request $request)
    {
        try {
            // Verificar que el usuario tenga rol root
            $user = auth()->user();
            if (!$user || !$user->hasRole('Root')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para realizar esta acción'
                ], 403);
            }

            // Cargar el archivo ubigeo.json
            $ubigeoPath = storage_path('app/utils/ubigeo.json');
            if (!file_exists($ubigeoPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Archivo ubigeo.json no encontrado'
                ], 404);
            }

            $ubigeoData = JSON::parse(File::get($ubigeoPath));
            
            // Crear un mapa de RENIEC => Datos completos para búsqueda rápida
            $ubigeoMap = [];
            foreach ($ubigeoData as $item) {
                if (isset($item['reniec']) && isset($item['distrito']) && isset($item['provincia']) && isset($item['departamento'])) {
                    $ubigeoMap[$item['reniec']] = [
                        'distrito' => $item['distrito'],
                        'provincia' => $item['provincia'],
                        'departamento' => $item['departamento']
                    ];
                }
            }

            // Obtener todos los registros de delivery_prices
            $deliveryPrices = DeliveryPrice::all();
            
            $processed = 0;
            $updated = 0;
            $notFound = 0;

            foreach ($deliveryPrices as $price) {
                $processed++;
                
                // Si el ubigeo existe en el mapa
                if (isset($ubigeoMap[$price->ubigeo])) {
                    $data = $ubigeoMap[$price->ubigeo];
                    
                    // Crear el nombre en formato: "DISTRITO, PROVINCIA - DEPARTAMENTO"
                    $newName = strtoupper($data['distrito']) . ', ' . 
                               strtoupper($data['provincia']) . ' - ' . 
                               strtoupper($data['departamento']);
                    
                    // Solo actualizar si el nombre es diferente
                    if ($price->name !== $newName) {
                        $price->name = $newName;
                        $price->save();
                        $updated++;
                    }
                } else {
                    $notFound++;
                    Log::warning("Ubigeo no encontrado en ubigeo.json", [
                        'ubigeo' => $price->ubigeo,
                        'id' => $price->id
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'processed' => $processed,
                'updated' => $updated,
                'notFound' => $notFound,
                'message' => "Validación completada: $updated registros actualizados de $processed procesados"
            ]);

        } catch (\Exception $e) {
            Log::error('Error en validateReniec: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al validar ubigeo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Previsualizar encabezados y muestras de un archivo Excel para mapeo
     */
    public function previewImport(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,txt',
        ]);

        $response = Response::simpleTryCatch(function () use ($request) {
            $file = $request->file('file');
            $sheets = Excel::toArray([], $file);

            if (empty($sheets) || empty($sheets[0])) {
                throw new \Exception('El archivo no contiene datos o está vacío.');
            }

            $rows = $sheets[0];
            $headers = [];
            $sampleRows = [];

            // Obtener encabezados (Fila 0)
            if (count($rows) > 0) {
                $rawHeaders = array_shift($rows);
                foreach ($rawHeaders as $index => $h) {
                    $headerName = trim(strval($h));
                    $headers[] = $headerName !== '' ? $headerName : "Columna " . ($index + 1);
                }
            }

            // Filtrar filas de muestra (hasta 3 filas no vacías)
            $sampleCount = 0;
            foreach ($rows as $row) {
                if ($sampleCount >= 3) break;
                // Verificar si tiene al menos un valor no nulo
                $hasValue = false;
                foreach ($row as $val) {
                    if (!is_null($val) && trim(strval($val)) !== '') {
                        $hasValue = true;
                        break;
                    }
                }
                if ($hasValue) {
                    $sampleRows[] = array_map(fn($v) => is_null($v) ? '' : trim(strval($v)), $row);
                    $sampleCount++;
                }
            }

            return [
                'success' => true,
                'preview' => [
                    'headers' => $headers,
                    'sample_rows' => $sampleRows,
                ]
            ];
        });

        return response($response->toArray(), $response->status);
    }

    /**
     * Importar datos desde Excel usando mapeo interactivo de columnas
     */
    public function importMapped(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,txt',
            'mode' => 'required|string|in:reset,add_update',
            'field_mappings' => 'required|string',
        ]);

        DB::beginTransaction();
        $response = Response::simpleTryCatch(function () use ($request) {
            $file = $request->file('file');
            $mode = $request->input('mode');
            $mappings = json_decode($request->input('field_mappings'), true) ?: [];

            // Si el modo es 'reset', se pueden eliminar los datos anteriores
            if ($mode === 'reset') {
                DeliveryPrice::query()->delete();
            }

            $sheets = Excel::toArray([], $file);
            if (empty($sheets) || empty($sheets[0])) {
                throw new \Exception('El archivo no contiene datos.');
            }

            $rows = $sheets[0];
            if (count($rows) < 2) {
                throw new \Exception('El archivo no contiene filas de datos.');
            }

            $rawHeaders = array_shift($rows);
            $headers = array_map(fn($h) => trim(strval($h)), $rawHeaders);

            // Invertir el mapeo para rápido acceso: systemKey => headerIndex
            $sysToColIndex = [];
            foreach ($mappings as $sysKey => $headerList) {
                $headerName = is_array($headerList) ? ($headerList[0] ?? null) : $headerList;
                if ($headerName) {
                    $colIdx = array_search($headerName, $headers);
                    if ($colIdx !== false) {
                        $sysToColIndex[$sysKey] = $colIdx;
                    }
                }
            }

            if (!isset($sysToColIndex['ubigeo'])) {
                throw new \Exception('Debe mapear la columna obligatoria de Ubigeo.');
            }

            $ubigeoPath = storage_path('app/utils/ubigeo.json');
            $ubigeoData = file_exists($ubigeoPath) ? JSON::parse(File::get($ubigeoPath)) : [];
            $ubigeoMap = [];
            foreach ($ubigeoData as $u) {
                if (isset($u['reniec'])) {
                    $ubigeoMap[strval($u['reniec'])] = $u;
                }
            }

            // Mapa de tiendas para matchear por ID, Nombre o Slug
            $allStores = \App\Models\Store::all();
            $storeLookup = [];
            foreach ($allStores as $s) {
                $storeLookup[mb_strtolower(trim($s->id))] = $s->id;
                $storeLookup[mb_strtolower(trim($s->name))] = $s->id;
                $storeLookup[mb_strtolower(trim($s->slug))] = $s->id;
            }

            $createdCount = 0;
            $updatedCount = 0;
            $skippedCount = 0;

            foreach ($rows as $rowIndex => $row) {
                // Función auxiliar para leer valor según mapeo
                $getValue = function($key, $default = null) use ($sysToColIndex, $row) {
                    if (!isset($sysToColIndex[$key])) return $default;
                    $idx = $sysToColIndex[$key];
                    if (!isset($row[$idx])) return $default;
                    $val = trim(strval($row[$idx]));
                    return $val !== '' ? $val : $default;
                };

                $getBoolean = function($key, $default = false) use ($getValue) {
                    $val = $getValue($key);
                    if (is_null($val)) return $default;
                    $valLower = strtolower(trim($val));
                    return in_array($valLower, ['1', 'true', 'si', 'sí', 'yes', 's', 'y', 'activo']);
                };

                $getNumeric = function($key, $default = 0) use ($getValue) {
                    $val = $getValue($key);
                    if (is_null($val)) return $default;
                    $clean = preg_replace('/[^\d.-]/', '', $val);
                    return is_numeric($clean) ? (float)$clean : $default;
                };

                $ubigeoVal = $getValue('ubigeo');
                if (!$ubigeoVal || !is_numeric($ubigeoVal)) {
                    $skippedCount++;
                    continue;
                }

                // Normalizar ubigeo a 6 dígitos si aplica
                $ubigeoStr = str_pad(strval($ubigeoVal), 6, '0', STR_PAD_LEFT);

                // Determinar nombre formateado
                $customName = $getValue('name');
                if ($customName) {
                    $name = Text::toTitleCase($customName);
                } else if (isset($ubigeoMap[$ubigeoStr])) {
                    $uObj = $ubigeoMap[$ubigeoStr];
                    $name = Text::toTitleCase("{$uObj['distrito']}, {$uObj['provincia']} - {$uObj['departamento']}");
                } else {
                    $name = "UBIGEO " . $ubigeoStr;
                }

                $price = $getNumeric('price', 0);
                $isStandard = isset($sysToColIndex['is_standard']) ? $getBoolean('is_standard', $price > 0) : ($price > 0);
                $isFree = $getBoolean('is_free', false);
                $expressPrice = $getNumeric('express_price', 0);
                $isExpress = isset($sysToColIndex['is_express']) ? $getBoolean('is_express', $expressPrice > 0) : ($expressPrice > 0);
                $isAgency = $getBoolean('is_agency', false);
                $agencyPrice = $getNumeric('agency_price', 0);
                $agencyPaymentOnDelivery = $getBoolean('agency_payment_on_delivery', false);
                $isStorePickup = $getBoolean('is_store_pickup', false);

                // Procesar tiendas seleccionadas por nombre o ID separadas por comas
                $rawStores = $getValue('selected_stores');
                $selectedStoreIds = null;
                if ($rawStores) {
                    $parts = preg_split('/[,;|]+/', $rawStores);
                    $matchedIds = [];
                    foreach ($parts as $part) {
                        $pClean = mb_strtolower(trim($part));
                        if (!empty($pClean) && isset($storeLookup[$pClean])) {
                            $matchedIds[] = $storeLookup[$pClean];
                        }
                    }
                    if (!empty($matchedIds)) {
                        $selectedStoreIds = array_values(array_unique($matchedIds));
                        $isStorePickup = true;
                    }
                }

                $typeId = $this->determineTypeId($isFree, $isAgency, $isExpress);

                $record = DeliveryPrice::where('ubigeo', $ubigeoStr)->first();
                if ($record) {
                    $record->update([
                        'name' => $name,
                        'price' => $price,
                        'is_standard' => $isStandard,
                        'is_free' => $isFree,
                        'is_express' => $isExpress,
                        'express_price' => $expressPrice,
                        'is_agency' => $isAgency,
                        'agency_price' => $agencyPrice,
                        'agency_payment_on_delivery' => $agencyPaymentOnDelivery,
                        'is_store_pickup' => $isStorePickup,
                        'selected_stores' => $selectedStoreIds ?? $record->selected_stores,
                        'type_id' => $typeId,
                    ]);
                    $updatedCount++;
                } else {
                    DeliveryPrice::create([
                        'ubigeo' => $ubigeoStr,
                        'name' => $name,
                        'price' => $price,
                        'is_standard' => $isStandard,
                        'is_free' => $isFree,
                        'is_express' => $isExpress,
                        'express_price' => $expressPrice,
                        'is_agency' => $isAgency,
                        'agency_price' => $agencyPrice,
                        'agency_payment_on_delivery' => $agencyPaymentOnDelivery,
                        'is_store_pickup' => $isStorePickup,
                        'selected_stores' => $selectedStoreIds,
                        'type_id' => $typeId,
                    ]);
                    $createdCount++;
                }
            }

            DB::commit();
            return [
                'success' => true,
                'created' => $createdCount,
                'updated' => $updatedCount,
                'skipped' => $skippedCount,
                'message' => "Importación completada: $createdCount creados, $updatedCount actualizados."
            ];
        }, function() {
            DB::rollBack();
        });

        return response($response->toArray(), $response->status);
    }

    /**
     * Actualización rápida masiva por Departamento / Provincia / Distrito
     */
    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'department' => 'required|string',
            'province' => 'nullable|string',
            'districts' => 'nullable|array',
        ]);

        DB::beginTransaction();
        $response = Response::simpleTryCatch(function () use ($request) {
            $department = mb_strtoupper(trim($request->input('department')), 'UTF-8');
            $province = $request->input('province') ? mb_strtoupper(trim($request->input('province')), 'UTF-8') : null;
            $districts = $request->input('districts') ?: [];
            $applyToMissing = $request->boolean('apply_to_missing', true);

            // Leer ubigeo.json
            $ubigeoPath = storage_path('app/utils/ubigeo.json');
            if (!file_exists($ubigeoPath)) {
                throw new \Exception('Archivo ubigeo.json no encontrado.');
            }

            $ubigeoData = JSON::parse(File::get($ubigeoPath));

            // Filtrar ubigeos coincidentes
            $matchedUbigeos = collect($ubigeoData)->filter(function ($item) use ($department, $province, $districts) {
                if (!is_array($item) || !isset($item['departamento'])) return false;

                $reniecCode = $item['reniec'] ?? $item['ubigeo'] ?? $item['inei'] ?? null;
                if ($reniecCode === null || $reniecCode === '') return false;

                // Departamento
                if ($department !== 'ALL' && mb_strtoupper(trim($item['departamento']), 'UTF-8') !== $department) {
                    return false;
                }

                // Provincia
                if ($province && $province !== 'ALL' && mb_strtoupper(trim($item['provincia'] ?? ''), 'UTF-8') !== $province) {
                    return false;
                }

                // Distritos
                if (!empty($districts)) {
                    $dName = mb_strtoupper(trim($item['distrito'] ?? ''), 'UTF-8');
                    $reniecPadded = str_pad(strval($reniecCode), 6, '0', STR_PAD_LEFT);

                    $cleanDistricts = array_map(function ($d) {
                        $str = strval($d);
                        return is_numeric($str) ? str_pad($str, 6, '0', STR_PAD_LEFT) : mb_strtoupper(trim($str), 'UTF-8');
                    }, $districts);

                    $matches = in_array($dName, $cleanDistricts) || in_array($reniecPadded, $cleanDistricts) || in_array(strval($reniecCode), $districts);
                    if (!$matches) return false;
                }

                return true;
            });

            if ($matchedUbigeos->isEmpty()) {
                throw new \Exception('No se encontraron ubigeos que coincidan con la ubicación seleccionada.');
            }

            // Opciones a aplicar
            $enableStandard = $request->boolean('enable_standard');
            $price = $request->float('price', 0);
            $enableFree = $request->boolean('enable_free');
            $enableExpress = $request->boolean('enable_express');
            $expressPrice = $request->float('express_price', 0);
            $enableAgency = $request->boolean('enable_agency');
            $agencyPrice = $request->float('agency_price', 0);
            $agencyPaymentOnDelivery = $request->boolean('agency_payment_on_delivery');
            $enableStorePickup = $request->boolean('enable_store_pickup');
            $selectedStores = $request->input('selected_stores', null);

            $typeId = $this->determineTypeId($enableFree, $enableAgency, $enableExpress, $enableStorePickup);

            $updatedCount = 0;
            $createdCount = 0;

            foreach ($matchedUbigeos as $u) {
                $reniecRaw = strval($u['reniec'] ?? $u['ubigeo'] ?? $u['inei'] ?? '');
                if ($reniecRaw === '') continue;

                $reniec = str_pad($reniecRaw, 6, '0', STR_PAD_LEFT);
                $distritoName = $u['distrito'] ?? '';
                $provinciaName = $u['provincia'] ?? '';
                $deptName = $u['departamento'] ?? '';
                $name = Text::toTitleCase("{$distritoName}, {$provinciaName} - {$deptName}");

                $record = DeliveryPrice::where('ubigeo', $reniec)
                    ->orWhere('ubigeo', $reniecRaw)
                    ->first();

                if ($record) {
                    $record->update([
                        'name' => $name,
                        'price' => $enableStandard ? $price : 0,
                        'is_standard' => $enableStandard,
                        'is_free' => $enableFree,
                        'is_express' => $enableExpress,
                        'express_price' => $enableExpress ? $expressPrice : 0,
                        'is_agency' => $enableAgency,
                        'agency_price' => $enableAgency && !$agencyPaymentOnDelivery ? $agencyPrice : 0,
                        'agency_payment_on_delivery' => $enableAgency ? $agencyPaymentOnDelivery : false,
                        'is_store_pickup' => $enableStorePickup,
                        'selected_stores' => $enableStorePickup ? ($selectedStores ?: null) : null,
                        'type_id' => $typeId,
                    ]);
                    $updatedCount++;
                } else if ($applyToMissing) {
                    DeliveryPrice::create([
                        'ubigeo' => $reniec,
                        'name' => $name,
                        'price' => $enableStandard ? $price : 0,
                        'is_standard' => $enableStandard,
                        'is_free' => $enableFree,
                        'is_express' => $enableExpress,
                        'express_price' => $enableExpress ? $expressPrice : 0,
                        'is_agency' => $enableAgency,
                        'agency_price' => $enableAgency && !$agencyPaymentOnDelivery ? $agencyPrice : 0,
                        'agency_payment_on_delivery' => $enableAgency ? $agencyPaymentOnDelivery : false,
                        'is_store_pickup' => $enableStorePickup,
                        'selected_stores' => $enableStorePickup ? ($selectedStores ?: null) : null,
                        'type_id' => $typeId,
                    ]);
                    $createdCount++;
                }
            }

            DB::commit();
            return [
                'success' => true,
                'updated' => $updatedCount,
                'created' => $createdCount,
                'total' => $updatedCount + $createdCount,
                'message' => "Ajuste rápido masivo completado: $updatedCount actualizados, $createdCount creados."
            ];
        }, function() {
            DB::rollBack();
        });

        return response($response->toArray(), $response->status);
    }

    /**
     * Descargar plantilla Excel prellenada con todos los ubigeos de Perú
     */
    public function downloadTemplate()
    {
        $fileName = 'Plantilla_Costos_Envio_Peru_' . date('Y-m-d') . '.xlsx';
        return Excel::download(new DeliveryPriceExport, $fileName);
    }
}

