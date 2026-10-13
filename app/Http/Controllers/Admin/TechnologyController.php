<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Technology;
use Illuminate\Http\Request;

class TechnologyController extends BasicController
{
    public $model = Technology::class;

    public $reactView = 'Admin/Technologies';

    public $imageFields = ['icon'];

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::query();
    }
}
