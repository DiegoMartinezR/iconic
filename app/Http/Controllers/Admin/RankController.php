<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Rank;
use Exception;
use Illuminate\Http\Request;
use SoDe\Extend\Response;

class RankController extends BasicController
{
    public $model = Rank::class;
    public $reactView = 'Admin/Ranks';
    public $defaultOrderBy = 'order_index';

    public function setReactViewProperties(Request $request)
    {
        return [
            // Propiedades adicionales si son necesarias
        ];
    }

    public function delete(Request $request, string $id)
    {
        $response = Response::simpleTryCatch(function () use ($id) {
            $rank = Rank::find($id);
            if (!$rank) {
                throw new Exception('El rango que intenta eliminar no existe.');
            }

            if (str_contains(strtolower($rank->name), 'promotor junior') || $rank->order_index == 0) {
                throw new Exception('El rango inicial "Promotor Junior" es obligatorio y no puede ser eliminado.');
            }

            $rank->delete();
            return ['message' => 'Rango eliminado correctamente.'];
        });

        return response($response->toArray(), $response->status);
    }
}
