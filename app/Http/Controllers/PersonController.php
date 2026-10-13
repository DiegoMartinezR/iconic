<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use SoDe\Extend\Fetch;
use SoDe\Extend\Response;
use DOMDocument;
use DOMXPath;
use SoDe\Extend\Text;

class PersonController extends Controller
{
    public function find(Request $request, string $dni)
    {
        $response = Response::simpleTryCatch(function () use ($dni) {
            $res = new Fetch(env('XDATA_URL') . '/prueba-gratis', [
                'method' => 'POST',
                'body' => [
                    'dni' => $dni
                ]
            ]);
            $html = $res->text();

            // Crear nuevo documento DOM
            $dom = new DOMDocument();
            @$dom->loadHTML($html, LIBXML_NOERROR);
            
            $xpath = new DOMXPath($dom);
            
            // Obtener datos de la tabla
            $table = $xpath->query("//table[@class='result-table']")->item(0);
            
            if (!$table) {
                throw new \Exception('No se encontraron datos');
            }

            $rows = $table->getElementsByTagName('tr');
            $data = [];
            
            foreach ($rows as $row) {
                $th = $row->getElementsByTagName('th')->item(0);
                $td = $row->getElementsByTagName('td')->item(0);
                
                if ($th && $td) {
                    $key = strtolower(str_replace(' ', '_', trim($th->textContent)));
                    $value = trim($td->textContent);
                    
                    // Omitir fecha_de_emisión y estatura
                    if (in_array($key, ['fecha_de_emisión', 'estatura'])) {
                        continue;
                    }
                    
                    // Procesar el DNI y su dígito verificador
                    if ($key === 'dni') {
                        $dniParts = explode('-', $value);
                        $data['dni'] = $dniParts[0];
                        if (isset($dniParts[1])) {
                            $data['digito_verificador'] = $dniParts[1];
                        }
                        continue;
                    }

                    if (in_array($key, ['nombres', 'padre', 'madre'])) {
                        $data[$key] = Text::toTitleCase($value);
                        continue;
                    }
                    
                    $data[$key] = $value;
                }
            }

            // Obtener y procesar la imagen
            $photoDiv = $xpath->query("//div[@class='result-photo-signature']//img")->item(0);
            if ($photoDiv) {
                $base64Image = $photoDiv->getAttribute('src');
                $imageData = explode(';base64,', $base64Image)[1] ?? null;
                
                if ($imageData) {
                    $imagePath = "app/images/person/{$dni}.jpeg";
                    $publicPath = env('APP_URL') . "/storage/images/person/{$dni}.jpeg";
                    
                    // Crear directorio si no existe
                    if (!file_exists(storage_path('app/images/person'))) {
                        mkdir(storage_path('app/images/person'), 0755, true);
                    }
                    
                    // Guardar imagen
                    file_put_contents(storage_path($imagePath), base64_decode($imageData));
                    $data['photo'] = $publicPath;
                }
            }

            return $data;
        });
        
        return response($response->toArray(), $response->status);
    }
}
