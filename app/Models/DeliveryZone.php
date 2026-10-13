<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryZone extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'district',
        'zone',
        'price',
        'delivery_days',
        'status',
    ];

    protected $casts = [
        'price' => 'float',
        'delivery_days' => 'array',
        'status' => 'boolean'
    ];
}
