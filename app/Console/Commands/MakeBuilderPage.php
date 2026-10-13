<?php

namespace App\Console\Commands;

use App\Models\System;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use SoDe\Extend\Crypto;
use SoDe\Extend\File;
use SoDe\Extend\JSON;

/**
 * Crea una página del builder: la registra en storage/app/pages.json y encadena
 * sus secciones en la tabla `systems` usando la lista enlazada `after_component`.
 *
 * Referencia: CONTEXT.md y docs/BUILDER_PLAYBOOK.md.
 */
class MakeBuilderPage extends Command
{
    protected $signature = 'builder:page
        {name : Nombre de la página (ej. "Promociones")}
        {path : Ruta (ej. /promociones o /producto/{slug})}
        {--id= : UUID de la página (por defecto se genera uno)}
        {--no-base : Crear la página sin extends_base}
        {--no-menu : Crear la página sin menuable}
        {--no-sitemap : Crear la página sin sitemapable}
        {--section=* : Sección con el formato "tipo:Opcion" (ej. slider:SliderInteractive). Repetible, se insertan en orden}
        {--base-section=* : Igual que --section pero en el base template (page_id null)}
        {--dry-run : Mostrar el plan sin escribir nada}';

    protected $description = 'Registra una página en pages.json y crea sus secciones encadenadas en la tabla systems';

    public function handle(): int
    {
        $name = trim((string) $this->argument('name'));
        $path = '/' . ltrim(trim((string) $this->argument('path')), '/');
        $pagesPath = storage_path('app/pages.json');
        $componentsPath = storage_path('app/components.json');

        if (!file_exists($pagesPath)) {
            $this->error("No existe {$pagesPath}. Créalo con un array [] o usa el admin /admin/system.");
            return 1;
        }
        if (!file_exists($componentsPath)) {
            $this->error("No existe {$componentsPath}. El catálogo de componentes es obligatorio.");
            return 1;
        }

        $pages = JSON::parse(File::get($pagesPath));
        $types = $this->readComponentTypes($componentsPath);

        $duplicada = collect($pages)->first(fn($p) => ($p['path'] ?? null) === $path);
        if ($duplicada) {
            $this->error("La ruta {$path} ya existe: \"{$duplicada['name']}\" ({$duplicada['id']}).");
            return 1;
        }

        try {
            $secciones = $this->parseSections($this->option('section'), $types, 'section');
            $baseSecciones = $this->parseSections($this->option('base-section'), $types, 'base-section');
        } catch (\RuntimeException $e) {
            return 1;
        }

        $page = [
            'id' => $this->option('id') ?: Crypto::randomUUID(),
            'name' => $name,
            'path' => $path,
            'extends_base' => !$this->option('no-base'),
            'menuable' => !$this->option('no-menu'),
            'pseudo_path' => str_contains($path, '{') ? Str::beforeLast($path, '/{') : $path,
            'sitemapable' => !$this->option('no-sitemap'),
            'referrable' => true,
        ];

        $this->line('');
        $this->info("Página: {$page['name']}  →  {$page['path']}");
        $this->table(
            ['id', 'extends_base', 'menuable', 'sitemapable', 'pseudo_path'],
            [[$page['id'], $page['extends_base'], $page['menuable'], $page['sitemapable'], $page['pseudo_path']]]
        );

        if (count($secciones) === 0 && count($baseSecciones) === 0) {
            $this->line('');
            $this->warn('Sin --section ni --base-section: se creará la página vacía.');
        }

        $this->warnIfBaseHasNoContent();

        if ($this->option('dry-run')) {
            $this->printPlan('base template', $baseSecciones, null);
            $this->printPlan($page['name'], $secciones, $page['id']);
            $this->line('');
            $this->warn('dry-run: no se escribió nada.');
            return 0;
        }

        File::save($pagesPath . '.bak', File::get($pagesPath));
        $pages[] = $page;
        File::save($pagesPath, JSON::stringify(array_values($pages), true));

        $this->line('');
        $baseIds = $this->insertChained($baseSecciones, null, 'base template');
        $pageIds = $this->insertChained($secciones, $page['id'], $page['name']);

        Cache::flush();
        if ($this->laravel->routesAreCached()) {
            $this->callSilently('route:clear');
            $this->callSilently('config:clear');
            $this->line('Rutas cacheadas detectadas: se ejecutaron route:clear y config:clear.');
        }

        $this->printCreated('base template', $baseSecciones, $baseIds);
        $this->printCreated($page['name'], $secciones, $pageIds);

        $this->line('');
        $this->comment("Siguiente paso: /admin/system → «{$name}» para editar data, copy, SEO y using.");
        $this->comment('Backup del JSON anterior: storage/app/pages.json.bak');
        $this->comment('Ver docs/BUILDER_PLAYBOOK.md §4.3 para completar la composición.');

        return 0;
    }

    private function readComponentTypes(string $path): array
    {
        $types = [];
        foreach (JSON::parse(File::get($path)) as $type) {
            $types[$type['id']] = array_column($type['options'] ?? [], 'id');
        }

        return $types;
    }

    /**
     * @return array<int, array{component:string, value:?string}>
     */
    private function parseSections(?array $raw, array $types, string $flag): array
    {
        $parsed = [];

        foreach ($raw ?? [] as $item) {
            [$component, $value] = array_pad(explode(':', trim((string) $item), 2), 2, null);
            $component = trim($component);
            $value = $value !== null && trim($value) !== '' ? trim($value) : null;

            if ($component === 'content') {
                $parsed[] = ['component' => 'content', 'value' => null];
                continue;
            }

            if (!array_key_exists($component, $types)) {
                $this->error("--{$flag}: el tipo \"{$component}\" no existe en components.json.");
                $this->line('  Tipos: ' . implode(', ', array_slice(array_keys($types), 0, 25)) . ' …');
                $this->line('  Ver docs/COMPONENTS_CATALOG.md');
                throw new \RuntimeException('tipo inválido');
            }

            if ($value !== null && !in_array($value, $types[$component], true)) {
                $this->error("--{$flag}: \"{$value}\" no es una opción de \"{$component}\".");
                $this->line('  Opciones: ' . implode(', ', array_slice($types[$component], 0, 25)) . ' …');
                $this->line('  Ver docs/COMPONENTS_CATALOG.md');
                throw new \RuntimeException('opción inválida');
            }

            $parsed[] = ['component' => $component, 'value' => $value];
        }

        return $parsed;
    }

    private function lastSystemId(?string $pageId): ?string
    {
        return $pageId === null
            ? System::whereNull('page_id')->orderByDesc('created_at')->value('id')
            : System::where('page_id', $pageId)->orderByDesc('created_at')->value('id');
    }

    private function warnIfBaseHasNoContent(): void
    {
        $hayContent = System::whereNull('page_id')->where('component', 'content')->exists();

        if (!$hayContent) {
            $this->warn('El base template no tiene fila "content": las páginas con extends_base saldrán sin cuerpo.');
            $this->line('  Crea la primera con:  php artisan builder:page ' . $this->argument('name') . ' ' . $this->argument('path') . ' --base-section=content --no-base');
        }
    }

    private function printPlan(string $destino, array $secciones, ?string $pageId): void
    {
        if (count($secciones) === 0) {
            return;
        }

        $prev = $this->lastSystemId($pageId) ?? 'null';
        $rows = [];
        foreach ($secciones as $i => $s) {
            $rows[] = [$i + 1, $destino, $s['component'], $s['value'] ?? '-', $prev];
            $prev = 'fila ' . ($i + 1);
        }

        $this->line('');
        $this->line("Plan ({$destino}):");
        $this->table(['#', 'destino', 'component', 'value', 'encadenado a'], $rows);
    }

    private function insertChained(array $secciones, ?string $pageId, string $destino): array
    {
        $ids = [];
        $prev = $this->lastSystemId($pageId);

        foreach ($secciones as $s) {
            $system = new System;
            $system->id = Crypto::randomUUID();
            $system->name = $s['value']
                ? ucfirst($s['component']) . ' - ' . $s['value']
                : ucfirst($s['component']);
            $system->component = $s['component'];
            $system->value = $s['value'];
            $system->page_id = $pageId;
            $system->after_component = $prev;
            $system->visible = true;
            $system->data = [];
            $system->element_id = sprintf(
                '%s-%s-%s',
                strtolower($s['component']),
                strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $s['value'] ?? 'base')),
                Crypto::short()
            );
            $system->save();

            $ids[] = $system;
            $prev = $system->id;
        }

        return $ids;
    }

    private function printCreated(string $destino, array $secciones, array $sistemas): void
    {
        if (count($sistemas) === 0) {
            return;
        }

        $rows = [];
        foreach ($sistemas as $i => $system) {
            $rows[] = [
                $i + 1,
                $destino,
                $system->component,
                $system->value ?? '-',
                $system->after_component ?? 'null',
                $system->element_id,
            ];
        }

        $this->line('');
        $this->line("Creado ({$destino}):");
        $this->table(['#', 'destino', 'component', 'value', 'after_component', 'element_id'], $rows);
    }
}
