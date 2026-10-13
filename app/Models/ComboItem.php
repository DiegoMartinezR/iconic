<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComboItem extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'combo_items';

    protected $fillable = ['combo_id', 'item_id', 'is_main_item'];

    public function combo()
    {
        return $this->belongsTo(Combo::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
