<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DeliveryZoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            // Zona 1 - S/. 8
            [
                'district' => 'Lince',
                'zone' => 'Zona 1',
                'price' => 8,
                'delivery_days' => json_encode(['M', 'X', 'V', 'S']),
            ],
            [
                'district' => 'San Isidro',
                'zone' => 'Zona 1',
                'price' => 8,
                'delivery_days' => json_encode(['L', 'M', 'X', 'V', 'S']),
            ],
            [
                'district' => 'San Borja',
                'zone' => 'Zona 1',
                'price' => 8,
                'delivery_days' => json_encode(['M', 'V']),
            ],
            [
                'district' => 'Jesús María',
                'zone' => 'Zona 1',
                'price' => 8,
                'delivery_days' => json_encode(['L', 'M', 'X', 'V', 'S']),
            ],
            [
                'district' => 'Barranco',
                'zone' => 'Zona 1',
                'price' => 8,
                'delivery_days' => json_encode(['X']),
            ],
            [
                'district' => 'Miraflores',
                'zone' => 'Zona 1',
                'price' => 8,
                'delivery_days' => json_encode(['M', 'X', 'V', 'S']),
            ],
            [
                'district' => 'Surco',
                'zone' => 'Zona 1',
                'price' => 8,
                'delivery_days' => json_encode(['M', 'X', 'V']),
            ],
            [
                'district' => 'Surquillo',
                'zone' => 'Zona 1',
                'price' => 8,
                'delivery_days' => json_encode(['M', 'X', 'V', 'S']),
            ],

            // Zona 2 - S/. 8
            [
                'district' => 'Santiago de Surco',
                'zone' => 'Zona 2',
                'price' => 8,
                'delivery_days' => json_encode(['X', 'V']),
            ],
            [
                'district' => 'Cercado de Lima',
                'zone' => 'Zona 2',
                'price' => 8,
                'delivery_days' => json_encode(['J']),
            ],
            [
                'district' => 'San Miguel',
                'zone' => 'Zona 2',
                'price' => 8,
                'delivery_days' => json_encode(['J']),
            ],
            [
                'district' => 'Pueblo Libre',
                'zone' => 'Zona 2',
                'price' => 8,
                'delivery_days' => json_encode(['L', 'J', 'S']),
            ],
            [
                'district' => 'Magdalena',
                'zone' => 'Zona 2',
                'price' => 8,
                'delivery_days' => json_encode(['X', 'S']),
            ],
            [
                'district' => 'Salamanca',
                'zone' => 'Zona 2',
                'price' => 8,
                'delivery_days' => json_encode(['M', 'V']),
            ],
            [
                'district' => 'Breña',
                'zone' => 'Zona 2',
                'price' => 8,
                'delivery_days' => json_encode(['L']),
            ],
            [
                'district' => 'San Luis',
                'zone' => 'Zona 2',
                'price' => 8,
                'delivery_days' => json_encode(['M']),
            ],

            // Zona 3 - S/. 10
            [
                'district' => 'S.M.P',
                'zone' => 'Zona 3',
                'price' => 10,
                'delivery_days' => json_encode(['J']),
            ],
            [
                'district' => 'Los Olivos',
                'zone' => 'Zona 3',
                'price' => 10,
                'delivery_days' => json_encode(['J']),
            ],
            [
                'district' => 'S.J.M',
                'zone' => 'Zona 3',
                'price' => 10,
                'delivery_days' => json_encode([]), // No listado
            ],
            [
                'district' => 'La Molina',
                'zone' => 'Zona 3',
                'price' => 10,
                'delivery_days' => json_encode(['M', 'V']),
            ],
            [
                'district' => 'Santa Anita',
                'zone' => 'Zona 3',
                'price' => 10,
                'delivery_days' => json_encode(['L']),
            ],
            [
                'district' => 'La Victoria',
                'zone' => 'Zona 3',
                'price' => 10,
                'delivery_days' => json_encode(['L']),
            ],
            [
                'district' => 'Callao',
                'zone' => 'Zona 3',
                'price' => 10,
                'delivery_days' => json_encode(['J']),
            ],
            [
                'district' => 'Comas',
                'zone' => 'Zona 3',
                'price' => 10,
                'delivery_days' => json_encode(['J']),
            ],
            [
                'district' => 'Independencia',
                'zone' => 'Zona 3',
                'price' => 10,
                'delivery_days' => json_encode(['J']),
            ],
        ];

        DB::table('delivery_zones')->insert($data);
    }
}
