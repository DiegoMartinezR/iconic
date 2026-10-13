<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Setting;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingController extends BasicController
{
    public $model = Setting::class;
    public $reactView = 'Settings';

    public function setReactViewProperties(Request $request)
    {
        $constants = $this->model::select()
            ->get();
        return [
            'constants' => $constants
        ];
    }

    public function beforeSave(Request $request)
    {
        $body = $request->all();
        $settingJpa = Setting::select()
            ->where('name', $body['name'])
            ->first();
        if (!$settingJpa) {
            unset($body['id']);
        } else {
            $body['id'] = $settingJpa->id;
        }
        return $body;
    }
}
