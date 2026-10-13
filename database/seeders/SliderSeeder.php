<?php

namespace Database\Seeders;

use App\Models\Slider;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SliderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 4; $i++) {
            Slider::updateOrCreate([
                'name' => 'Título de slider ' . $i,
            ], [
                'description' => 'Una breve descripción de mi slider ' . $i . ', y algo mas de texto',
                'button_text' => 'Botón dummy',
                'button_link' => '/',
                'visible' => true,
                'status' => true,
            ]);
        }
    }
}
