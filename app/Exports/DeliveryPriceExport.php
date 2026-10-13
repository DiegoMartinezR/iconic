<?php

namespace App\Exports;

use App\Models\DeliveryPrice;
use App\Models\Store;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use SoDe\Extend\File;
use SoDe\Extend\JSON;

class DeliveryPriceExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
{
    protected $existingPrices;
    protected $storesMap;

    public function __construct()
    {
        // Cargar todos los precios existentes en base de datos indexados por ubigeo
        $this->existingPrices = DeliveryPrice::all()->keyBy('ubigeo');

        // Mapa de tiendas ID => Nombre
        $this->storesMap = Store::pluck('name', 'id')->toArray();
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $ubigeoPath = storage_path('app/utils/ubigeo.json');
        if (!file_exists($ubigeoPath)) {
            $ubigeoPath = base_path('storage/app/utils/ubigeo.json');
        }

        $ubigeoList = [];
        if (file_exists($ubigeoPath)) {
            $ubigeoList = JSON::parse(File::get($ubigeoPath));
        }

        $rows = new Collection();

        foreach ($ubigeoList as $item) {
            $reniec = str_pad(trim($item['reniec'] ?? $item['inei'] ?? ''), 6, '0', STR_PAD_LEFT);
            if (empty($reniec)) continue;

            $dept = strtoupper(trim($item['departamento'] ?? ''));
            $prov = strtoupper(trim($item['provincia'] ?? ''));
            $dist = strtoupper(trim($item['distrito'] ?? ''));

            $formattedName = "{$dist}, {$prov} - {$dept}";

            // Buscar si ya existe en base de datos
            $dbRecord = $this->existingPrices->get($reniec);

            // Formatear tiendas seleccionadas separadas por comas
            $selectedStoresStr = '';
            if ($dbRecord && $dbRecord->is_store_pickup) {
                if (!empty($dbRecord->selected_stores) && is_array($dbRecord->selected_stores)) {
                    $storeNames = [];
                    foreach ($dbRecord->selected_stores as $storeId) {
                        if (isset($this->storesMap[$storeId])) {
                            $storeNames[] = $this->storesMap[$storeId];
                        } else {
                            $storeNames[] = $storeId;
                        }
                    }
                    $selectedStoresStr = implode(', ', $storeNames);
                }
            }

            $rows->push([
                'ubigeo' => $reniec,
                'departamento' => $dept,
                'provincia' => $prov,
                'distrito' => $dist,
                'nombre_ubicacion' => $dbRecord->name ?? $formattedName,
                'precio_estandar' => $dbRecord ? number_format($dbRecord->price, 2, '.', '') : '0.00',
                'is_standard' => $dbRecord ? ($dbRecord->is_standard ? 1 : 0) : 1,
                'is_free' => $dbRecord ? ($dbRecord->is_free ? 1 : 0) : 0,
                'is_express' => $dbRecord ? ($dbRecord->is_express ? 1 : 0) : 0,
                'express_price' => $dbRecord ? number_format($dbRecord->express_price, 2, '.', '') : '0.00',
                'is_agency' => $dbRecord ? ($dbRecord->is_agency ? 1 : 0) : 0,
                'agency_price' => $dbRecord ? number_format($dbRecord->agency_price, 2, '.', '') : '0.00',
                'agency_payment_on_delivery' => $dbRecord ? ($dbRecord->agency_payment_on_delivery ? 1 : 0) : 0,
                'is_store_pickup' => $dbRecord ? ($dbRecord->is_store_pickup ? 1 : 0) : 0,
                'selected_stores' => $selectedStoresStr,
            ]);
        }

        return $rows;
    }

    /**
     * Encabezados del Excel
     */
    public function headings(): array
    {
        return [
            'UBIGEO_RENIEC',
            'DEPARTAMENTO',
            'PROVINCIA',
            'DISTRITO',
            'NOMBRE_UBICACION',
            'PRECIO_ESTANDAR',
            'DELIVERY_ESTANDAR_ACTIVO',
            'ENVIO_GRATIS_ACTIVO',
            'DELIVERY_EXPRESS_ACTIVO',
            'PRECIO_EXPRESS',
            'RECOJO_AGENCIA_ACTIVO',
            'PRECIO_AGENCIA',
            'AGENCIA_PAGO_EN_DESTINO',
            'RETIRO_TIENDA_ACTIVO',
            'TIENDAS_SELECCIONADAS',
        ];
    }

    /**
     * Mapeo de datos por fila
     */
    public function map($row): array
    {
        return [
            $row['ubigeo'],
            $row['departamento'],
            $row['provincia'],
            $row['distrito'],
            $row['nombre_ubicacion'],
            $row['precio_estandar'],
            $row['is_standard'],
            $row['is_free'],
            $row['is_express'],
            $row['express_price'],
            $row['is_agency'],
            $row['agency_price'],
            $row['agency_payment_on_delivery'],
            $row['is_store_pickup'],
            $row['selected_stores'],
        ];
    }

    /**
     * Anchos de columna optimizados
     */
    public function columnWidths(): array
    {
        return [
            'A' => 16, // UBIGEO_RENIEC
            'B' => 20, // DEPARTAMENTO
            'C' => 22, // PROVINCIA
            'D' => 24, // DISTRITO
            'E' => 38, // NOMBRE_UBICACION
            'F' => 18, // PRECIO_ESTANDAR
            'G' => 26, // DELIVERY_ESTANDAR_ACTIVO
            'H' => 22, // ENVIO_GRATIS_ACTIVO
            'I' => 24, // DELIVERY_EXPRESS_ACTIVO
            'J' => 18, // PRECIO_EXPRESS
            'K' => 24, // RECOJO_AGENCIA_ACTIVO
            'L' => 18, // PRECIO_AGENCIA
            'M' => 26, // AGENCIA_PAGO_EN_DESTINO
            'N' => 24, // RETIRO_TIENDA_ACTIVO
            'O' => 36, // TIENDAS_SELECCIONADAS
        ];
    }

    /**
     * Estilos del Excel
     */
    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:O1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['argb' => Color::COLOR_WHITE],
                'size' => 11,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => '1F2937'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        $sheet->getStyle('A2:A3000')->getNumberFormat()->setFormatCode('@');

        return [];
    }
}
