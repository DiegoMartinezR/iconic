<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductAnalytic extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';


    protected $fillable = [
        'item_id',
        'user_id',
        'session_id',
        'event_type',
        'device_type',
        'source',
        'time_spent',
        'converted'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class)->select('id', 'name', 'image');
    }
}