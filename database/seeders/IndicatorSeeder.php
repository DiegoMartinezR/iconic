<?php

namespace Database\Seeders;

use App\Models\Indicator;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IndicatorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $indicators = [
            ['symbol' => 'k', 'name' => '42', 'description' => 'Profesionales capacitados'],
            ['symbol' => '%', 'name' => '99', 'description' => 'Retorno de inversión'],
            ['symbol' => '+', 'name' => '36', 'description' => 'Empresas que confían'],
        ];

        Indicator::where('status', true)->delete();
        foreach ($indicators as $indicator) {
            Indicator::create($indicator);
        }
    }
}
