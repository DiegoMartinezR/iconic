<?php

namespace Database\Seeders;

use App\Models\TypeDelivery;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DeliveryTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [

                'name' => 'Envío Gratis',
                'slug' => 'envio-gratis',
                'description' => 'Entrega entre 3 a 10 días hábiles',

            ],
            [

                'name' => 'Delivery Express',
                'slug' => 'delivery-express',
                'description' => 'Delivery 24 horas. Solo Lima Metropolitana: Dentro de las 24 horas después de efectuado el pago, solo algunos distritos de Lima Metropolitana. Distritos No incluidos: Santa María del Mar, Pucusana, San Bartolo, Punta Hermosa, Lurín, Pachacamac, Chorrillos, Villa el Salvador, Villa María del Triunfo, San Juan de Miraflores, Cieneguilla, Ate, Chosica, Huaycan, San Juan de Lurigancho (hasta el Metro), Ancón, Santa Rosa, Carabayllo, Puente Piedra. Same Day: Solo para compras efectuadas hasta las 1pm del día.',

            ],
            [

                'name' => 'Delivery Normal',
                'slug' => 'delivery-normal',
                'description' => 'Lima: 3 a 4 días hábiles | Provincia: de 4 a 10 días hábiles',

            ],
            [

                'name' => 'Delivery en Agencia',
                'slug' => 'delivery-agencia',
                'description' => 'Provincia: de 4 a 10 días hábiles',

            ]
        ];

        foreach ($types as $type) {
            TypeDelivery::updateOrCreate(
                ['slug' => $type['slug']],
                $type
            );
        }
    }
}
