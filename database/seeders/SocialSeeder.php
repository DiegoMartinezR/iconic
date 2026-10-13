<?php

namespace Database\Seeders;

use App\Models\Social;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SocialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $socials = [
            [
                'name' => 'Kaori',
                'description' => 'Facebook',
                'icon' => 'fab fa-facebook-f',
                'link' => 'https://facebook.com'
            ],
            [
                'name' => 'Kaori',
                'description' => 'WhatsApp',
                'icon' => 'fab fa-whatsapp',
                'link' => 'https://whatsapp.com'
            ],
            [
                'name' => 'Kaori',
                'description' => 'Instagram',
                'icon' => 'fab fa-instagram',
                'link' => 'https://instagram.com'
            ],
            [
                'name' => 'Kaori',
                'description' => 'LinkedIn',
                'icon' => 'fab fa-linkedin-in',
                'link' => 'https://linkedin.com'
            ],
        ];

        foreach ($socials as $social) {
            Social::updateOrCreate([
                'icon' => $social['icon']
            ], [
                'name' => $social['name'],
                'description' => $social['description'],
                'link' => $social['link']
            ]);
        }
    }
}
