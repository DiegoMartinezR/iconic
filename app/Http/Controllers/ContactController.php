<?php

namespace App\Http\Controllers;

use App\Models\General;
use Illuminate\Http\Request;

class ContactController extends BasicController
{
    public $reactView = 'Contact';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $generals = General::all();
        return [
            'generals' => $generals
        ];
    }
}
