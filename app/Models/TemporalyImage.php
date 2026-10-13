<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemporalyImage extends Model
{
    use HasFactory;
    protected $fillable = ['filename'];
}
