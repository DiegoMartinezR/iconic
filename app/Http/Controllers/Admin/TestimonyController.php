<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Testimony;
use App\Models\WebDetail;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\File;
use SoDe\Extend\JSON;

class TestimonyController extends BasicController
{
    public $model = Testimony::class;
    public $reactView = 'Admin/Testimonies';
    public $imageFields = ['image'];

    public function setReactViewProperties(Request $request)
    {
        $countries = JSON::parse(File::get('../storage/app/utils/countries.json'));
        $details = WebDetail::where('page', 'testimonies')->get();
        return [
            'countries' => $countries,
            'details' => $details
        ];
    }


}
