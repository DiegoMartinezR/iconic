<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\DeliveryPrice;
use App\Models\TypeDelivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use Maatwebsite\Excel\Facades\Excel;
use SoDe\Extend\Response;
use SoDe\Extend\Text;

class TypesDeliveryController extends BasicController
{
    public $model = TypeDelivery::class;
    // public $reactView = 'Admin/DeliveryPricesType';

    public function beforeSave(Request $request)
    {

        $body = $request->all();



        // Procesar características
        if ($request->has('characteristics')) {
            $characteristics = json_decode($request->characteristics, true);
            $body['characteristics'] = array_values(array_filter($characteristics, function ($item) {
                return !empty(trim($item));
            }));
        }


        return $body;
    }
}
