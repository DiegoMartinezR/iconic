<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseStudy extends Model
{
    use HasFactory, HasUuids, HasDynamic;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'slug',
        'summary',
        'description',
        'client',
        'before',
        'after',
        'impact',
        'author',
        'video_url',
        'image',
        'background_image',
        'project_id',
        'order_index',
        'visible',
        'featured',
        'status',
        'challenge',
        'solution',
        'indicators',
        'strengths',
        'steps',
        'faqs',
        'meta_title',
        'meta_description',
        'meta_keywords',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'featured' => 'boolean',
        'status' => 'boolean',
        'indicators' => 'array',
        'strengths' => 'array',
        'steps' => 'array',
        'faqs' => 'array',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
