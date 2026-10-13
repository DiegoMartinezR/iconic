<?php

namespace Database\Seeders;

use App\Models\Testimony;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestimonySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testimonies = [
            [
                'name' => 'Leslie Alexander',
                'country' => 'South Africa',
                'description' => 'Gracias a los cursos de Transciende, *he aprendido a superar mis barreras y a alcanzar metas* que antes parecían imposibles. El acompañamiento ha sido fundamental en mi desarrollo tanto personal como profesional.'
            ],
            [
                'name' => 'Guy Hawkins',
                'country' => 'UK',
                'description' => 'La experiencia en Transciende ha sido transformadora. No solo he aprendido nuevas habilidades, sino que también *he descubierto mi verdadero potencial*. Los talleres me dieron herramientas prácticas que utilizo a diario.'
            ],
            [
                'name' => 'Wade Warren',
                'country' => 'Australia',
                'description' => 'Transciende me ayudó a mejorar mi enfoque y encontrar claridad en mi vida profesional. *Los cursos están llenos de contenido valioso* que realmente marca una diferencia.'
            ],
        ];

        foreach ($testimonies as $testimony) {
            Testimony::updateOrCreate(
                ['name' => $testimony['name']],
                [
                    'country' => $testimony['country'],
                    'description' => $testimony['description']
                ]
            );
        }
    }
}
