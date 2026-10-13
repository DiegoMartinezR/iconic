<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
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
        'location',
        'date',
        'project_category_id',
        'service_category_id',
        'image',
        'background_image',
        'visible',
        'featured',
        'status',
        'order_index',
        'tech',
        'metrics',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'faqs',
        'challenge',
        'solution',
        'website_url',
        'video_url',
        'indicators',
        'strengths',
        'steps',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'featured' => 'boolean',
        'status' => 'boolean',
        'faqs' => 'array',
        'tech' => 'array',
        'indicators' => 'array',
        'strengths' => 'array',
        'steps' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(ProjectCategory::class, 'project_category_id');
    }

    public function serviceCategory()
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function case_studies()
    {
        return $this->hasMany(CaseStudy::class, 'project_id');
    }

    public function technologies()
    {
        return $this->belongsToMany(Technology::class, 'project_technology', 'project_id', 'technology_id');
    }

    public function images()
    {
        return $this->hasMany(ProjectImage::class)->orderBy('order');
    }
}
