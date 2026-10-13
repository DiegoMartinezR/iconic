<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\WebDetail;
use Illuminate\Http\Request;

class WebDetailController extends BasicController
{
    public $model = WebDetail::class;

    public function beforeSave(Request $request)
    {
        $body = $request->all();
        $jpa = WebDetail::select()
            ->where('page', $body['page'])
            ->where('name', $body['name'])
            ->first();

        if ($jpa) $body['id'] = $jpa->id;

        return $body;
    }
}
