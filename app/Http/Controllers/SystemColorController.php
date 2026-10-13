<?php

namespace App\Http\Controllers;

use App\Models\SystemColor;
use App\Http\Requests\StoreSystemColorRequest;
use App\Http\Requests\UpdateSystemColorRequest;

class SystemColorController extends BasicController
{
    public $model = SystemColor::class;
}
