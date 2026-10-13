<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use SoDe\Extend\File;
use SoDe\Extend\JSON;

class TypeDelivery extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'types_delivery';
    protected $fillable = ['name', 'slug', 'description', 'characteristics'];

    public function deliveryPrices(): HasMany
    {
        return $this->hasMany(DeliveryPrice::class, 'type_id');
    }
    protected $guarded = ['slug'];
    protected $casts = [
        'characteristics' => 'array',

    ];

    protected static function booted()
    {
        static::saving(function ($producto) {
            // Evitar la actualización del slug
            if ($producto->isDirty('name')) {
                $producto->slug = $producto->getOriginal('slug');
            }
        });
    }

    public function setSlugAttribute($value)
    {
        // Si el slug ya está establecido, no lo cambies
        if ($this->exists && $this->slug) {
            return;
        }

       
    }
}
