<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectCategory;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoriesData = [
            [
                'name' => 'Sistemas Web',
                'slug' => 'sistemas-web',
                'description' => 'Desarrollo de software y plataformas web a medida para empresas.',
            ],
            [
                'name' => 'Inteligencia Artificial',
                'slug' => 'ia',
                'description' => 'Agentes de IA, chatbots y automatización avanzada.',
            ],
            [
                'name' => 'Plataformas CRM',
                'slug' => 'crm',
                'description' => 'Centralización de prospectos, clientes y flujos comerciales.',
            ],
            [
                'name' => 'E-Commerce Enterprise',
                'slug' => 'e-commerce',
                'description' => 'Tiendas virtuales de alto rendimiento y arquitectura headless.',
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $idx => $cat) {
            $categories[$cat['slug']] = ProjectCategory::updateOrCreate(
                ['slug' => $cat['slug']],
                [
                    'name' => $cat['name'],
                    'description' => $cat['description'],
                    'order_index' => $idx + 1,
                    'featured' => true,
                    'visible' => true,
                    'status' => true,
                ]
            );
        }

        $projects = [
            [
                'name' => 'Plataforma ERP & Gestión Operativa en la Nube',
                'slug' => 'plataforma-erp-gestion-operativa',
                'summary' => 'Sistema web a medida para centralizar compras, inventarios y facturación electrónica con métricas en tiempo real.',
                'description' => 'Diseñamos e implementamos una plataforma web a medida para centralizar la gestión logística y operativa. Incluye control de roles por niveles, exportación de reportes ejecutivos y backup automatizado en la nube.',
                'client' => 'Corporación Industrial del Perú',
                'metrics' => '+240% Eficiencia Operativa',
                'tech' => ['Laravel', 'React', 'PostgreSQL', 'TailwindCSS', 'Docker'],
                'category_slug' => 'sistemas-web',
                'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                'featured' => true,
                'order_index' => 1,
            ],
            [
                'name' => 'Agente de Inteligencia Artificial Conversacional 24/7',
                'slug' => 'agente-ia-conversacional',
                'summary' => 'Chatbot inteligente entrenado con políticas y catálogos corporativos para atención y cualificación de prospectos.',
                'description' => 'Desarrollamos un agente de IA con arquitectura RAG conectado a modelos avanzados de lenguaje. Atiende consultas comerciales las 24 horas del día, reduciendo la carga operativa del equipo de soporte.',
                'client' => 'Grupo Financiero & Fintech',
                'metrics' => '98.5% Respuestas Automáticas Precisas',
                'tech' => ['Python', 'OpenAI API', 'FastAPI', 'React', 'Vector DB'],
                'category_slug' => 'ia',
                'image' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
                'featured' => true,
                'order_index' => 2,
            ],
            [
                'name' => 'E-Commerce Headless de Alta Velocidad',
                'slug' => 'e-commerce-headless-alta-velocidad',
                'summary' => 'Plataforma omnicanal multitienda optimizada para Core Web Vitals y procesamiento masivo de transacciones.',
                'description' => 'Construimos una arquitectura e-commerce moderna con renderizado híbrido y caché en memoria. Permite procesar miles de pedidos simultáneos con un tiempo de respuesta de sub-segundo.',
                'client' => 'Cadena Retail Internacional',
                'metrics' => '0.6s Tiempo de Carga | +180% Conversión',
                'tech' => ['Next.js', 'Node.js', 'Redis', 'GraphQL', 'Stripe'],
                'category_slug' => 'e-commerce',
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
                'featured' => true,
                'order_index' => 3,
            ],
            [
                'name' => 'CRM Comercial & Automatización de Prospectos',
                'slug' => 'crm-comercial-automatizacion',
                'summary' => 'Plataforma CRM personalizada para gestionar pipelines de ventas, respuestas automáticas por WhatsApp y correos.',
                'description' => 'Sistema de gestión de relaciones con clientes para controlar las etapas de ventas, asignar leads automáticamente por asesor e integrarse con pasarelas de pago y facturación.',
                'client' => 'Distribuidora Tech B2B',
                'metrics' => '+150% Cierre de Ventas',
                'tech' => ['Laravel', 'Vue.js', 'WhatsApp API', 'MySQL'],
                'category_slug' => 'crm',
                'image' => 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
                'featured' => true,
                'order_index' => 4,
            ],
        ];

        foreach ($projects as $p) {
            $cat = $categories[$p['category_slug']] ?? null;

            Project::updateOrCreate(
                ['slug' => $p['slug']],
                [
                    'name' => $p['name'],
                    'summary' => $p['summary'],
                    'description' => $p['description'],
                    'client' => $p['client'],
                    'project_category_id' => $cat?->id,
                    'image' => $p['image'],
                    'featured' => $p['featured'],
                    'visible' => true,
                    'status' => true,
                    'order_index' => $p['order_index'],
                    'tech' => $p['tech'],
                    'metrics' => $p['metrics'],
                ]
            );
        }
    }
}
