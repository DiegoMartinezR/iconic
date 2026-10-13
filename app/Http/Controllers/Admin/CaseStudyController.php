<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\CaseStudy;

use App\Models\Project;
use Illuminate\Http\Request;

class CaseStudyController extends BasicController
{
    public $model = CaseStudy::class;
    public $reactView = 'Admin/CaseStudies';
    public $defaultOrderBy = 'order_index';
    public $imageFields = ['image', 'background_image'];
    public $with4get = ['project'];

    public function setReactViewProperties(Request $request)
    {
        return [
            'projects' => Project::select('id', 'name')->orderBy('name')->get()
        ];
    }
}
