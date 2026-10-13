<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Strength;
use App\Models\WebDetail;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StrengthController extends BasicController
{
    public $model = Strength::class;
    public $reactView = 'Admin/Strength';
    public $imageFields = ['image'];

    public function setReactViewProperties(Request $request)
    {
        $details = WebDetail::where('page', 'values')->get();
        return [
            'details' => $details,
        ];
    }
}
