<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\SystemColor;
use Illuminate\Http\Request;

class SystemColorController extends BasicController
{
    public $model = SystemColor::class;

    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        return $jpa;
    }
}
