<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\DeliveryZone;
use Illuminate\Http\Request;

class DeliveryZoneController extends BasicController
{
    public $model = DeliveryZone::class;
    public $reactView = 'Admin/DeliveryZones';
}
