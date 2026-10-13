<?php

namespace Database\Seeders;

use App\Models\CaseStudy;
use Illuminate\Database\Seeder;

class CaseStudySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cases = [
            [
                'name' => 'Transformación Digital e-Commerce Retail',
                'client' => 'Empresa Retail Líder',
                'impact' => '+215% Ventas Digitales',
                'before' => '4.2s tiempo de carga | 1.2% tasa de conversión',
                'after' => '0.8s tiempo de carga | 3.8% tasa de conversión',
                'description' => 'Rhino Technology transformó nuestra infraestructura e-commerce, multiplicando los ingresos digitales desde el primer trimestre.',
                'author' => 'Director de E-commerce',
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                'order_index' => 1,
            ],
            [
                'name' => 'Automatización de Flujos Operativos con IA',
                'client' => 'Corporación Financiera',
                'impact' => '98% Reducción de Tiempos',
                'before' => 'Procesos de aprobación manuales de 48 horas',
                'after' => 'Aprobación automática de solicitudes en < 2 minutos',
                'description' => 'El sistema web con automatización e Inteligencia Artificial redujo drásticamente nuestros costos operativos y tiempos de respuesta.',
                'author' => 'VP de Operaciones',
                'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                'order_index' => 2,
            ],
        ];

        foreach ($cases as $c) {
            CaseStudy::updateOrCreate(
                ['name' => $c['name']],
                [
                    'client' => $c['client'],
                    'impact' => $c['impact'],
                    'before' => $c['before'],
                    'after' => $c['after'],
                    'description' => $c['description'],
                    'author' => $c['author'],
                    'image' => $c['image'],
                    'order_index' => $c['order_index'],
                    'visible' => true,
                    'featured' => true,
                    'status' => true,
                ]
            );
        }
    }
}
