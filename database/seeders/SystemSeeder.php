<?php

namespace Database\Seeders;

use App\Models\System;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use SoDe\Extend\Crypto;

class SystemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Descomentar los comentarios si se quiere arrancar con un sistema basico
        $systems = [
            // [
            //     'id' => '42480980-a7fc-495b-a834-cbdca39dfde9',
            //     'name' => 'Cintillo - Con redes sociales',
            //     'page_id' => null,
            //     'component' => 'top_bar',
            //     'value' => 'TopBarSocials',
            //     'after_component' => null
            // ],
            // [
            //     'id' => 'c8551507-eb21-4a45-93df-8e17a22096f1',
            //     'name' => 'Header - Search',
            //     'page_id' => null,
            //     'component' => 'header',
            //     'value' => 'HeaderSearch',
            //     'after_component' => '42480980-a7fc-495b-a834-cbdca39dfde9'
            // ],
            [
                'id' => '26b46e06-da01-4f06-b47e-379a538037a1',
                'name' => 'Content',
                'page_id' => null,
                'component' => 'content',
                'value' => null,
                // 'after_component' => 'c8551507-eb21-4a45-93df-8e17a22096f1'
            ],
            // [
            //     'id' => Crypto::randomUUID(),
            //     'name' => 'Footer - Call to Action Simple',
            //     'page_id' => null,
            //     'component' => 'footer',
            //     'value' => 'FooterSimpleCallToAction',
            //     'after_component' => '26b46e06-da01-4f06-b47e-379a538037a1'
            // ],
        ];

        foreach ($systems as $system) {
            System::updateOrCreate([
                'component' => $system['component'],
                'value' => $system['value']
            ], $system);
        }
    }
}
