<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryVault extends Model
{
    use HasFactory;

    protected $table = 'inventory_vault';

    protected $fillable = [
        'user_id',
        'item_id',
        'quantity',
        'destination',
        'claim_type',
        'claim_status',
        'claim_address',
        'claim_notes',
        'claimed_at',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'claimed_at' => 'datetime',
    ];

    /**
     * El usuario dueño de este inventario virtual (promotor/vendedor)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * El producto físico asociado
     */
    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
