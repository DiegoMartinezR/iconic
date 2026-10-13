<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\Rules\Exists;

class MakeReactView extends Command
{
    // El nombre y la descripción del comando
    protected $signature = 'make:reactView {name : Nombre de la vista}';
    protected $description = 'Crea una nueva vista React en resources/js';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Obtener el nombre del archivo de la vista
        $name = $this->argument('name');
        $nameLower = strtolower($name);

        // Obtener solo el último trozo de palabras
        $singleName = basename($name);
        $singleNameLower = strtolower($singleName);

        $restPath = resource_path("js/Actions/{$name}Rest.js");
        $path = resource_path("js/{$name}.jsx");

        $restExists = false;
        $exists = false;
        if (File::exists($restPath)) {
            $this->error("El RestClient {$singleName}Rest ya existe.");
            $restExists = true;
        }
        if (File::exists($path)) {
            $this->error("La vista {$singleName} ya existe.");
            $exists = true;
        }

        $restTemplate = <<<JS
import BasicRest from '@Rest/BasicRest.js';

class {$singleName}Rest extends BasicRest {
  path = '{$nameLower}'
}

export default {$singleName}Rest
JS;

        // Crear el contenido inicial de la vista
        $template = <<<JS
import React from 'react';
import {$singleName}Rest from '@Rest/{$name}Rest';
import CreateReactScript from '@Utils/CreateReactScript';
import { createRoot } from 'react-dom/client';

const {$singleNameLower}Rest = new {$singleName}Rest();

const {$singleName} = () => {
    return (
        <div>
            <h1>{$singleName} Component</h1>
        </div>
    );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<{$singleName} {...properties} />);
})
JS;

        if (!$restExists) {
            File::put($restPath, $restTemplate);
            $this->info("RestClient creado: {$restPath}");
        }

        if (!$exists) {
            File::put($path, $template);
            $this->info("Vista React creada: {$path}");
        }
    }
}
