<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends BasicController
{
   public $model = Message::class;
   public $reactView = 'Admin/Messages';

   public function setPaginationInstance(Request $request, string $model)
   {
      return $model::where('status', true);
   }
}
