<?php

namespace Database\Seeders;

use App\Models\Strength;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StrengthSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $strengths = [
            [
                'name' => 'Compromiso con el bienestar',
                'description' => 'Nos enfocamos en promover hábitos que mejoren la calidad de vida, motivando a cada persona a cuidar de su salud física y mental.'
            ],
            [
                'name' => 'Enfoque integral',
                'description' => 'Ofrecemos una metodología que abarca el desarrollo personal, profesional y emocional para lograr una transformación completa.'
            ],
            [
                'name' => 'Crecimiento sostenido',
                'description' => 'Promovemos el crecimiento a través de cambios progresivos y sostenibles, generando resultados que perduran en el tiempo.'
            ],
            [
                'name' => 'Resiliencia y superación',
                'description' => 'Enseñamos a enfrentar y superar los desafíos, desarrollando una mentalidad fuerte y resiliente ante cualquier adversidad.'
            ],
            [
                'name' => 'Inspiración constante',
                'description' => 'Motivamos a nuestros estudiantes a mantenerse inspirados y enfocados en sus metas, creando un ambiente de constante superación.'
            ]
        ];

        foreach ($strengths as $strength) {
            Strength::updateOrCreate([
                'name' => $strength['name']
            ], [
                'description' => $strength['description']
            ]);
        }
    }
}
