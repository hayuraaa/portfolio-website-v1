<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'features',
        'image',
        'gallery',
        'technologies',
        'demo_url',
        'github_url',
        'category',
        'is_featured',
        'is_active',
        'completed_at',
        'sort_order'
    ];

    protected $casts = [
        'gallery' => 'array',
        'technologies' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'completed_at' => 'date',
    ];

    protected $appends = ['image_url', 'gallery_urls'];

    // Auto-generate slug when creating
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($project) {
            if (empty($project->slug)) {
                $project->slug = Str::slug($project->title);
            }
        });

        static::updating(function ($project) {
            if ($project->isDirty('title')) {
                $project->slug = Str::slug($project->title);
            }
        });
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Accessors
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        return asset('images/default-project.svg');
    }

    public function getGalleryUrlsAttribute()
    {
        if ($this->gallery && is_array($this->gallery)) {
            return array_map(function ($path) {
                return asset('storage/' . $path);
            }, $this->gallery);
        }
        return [];
    }

    // Helper methods
    public static function getCategories()
    {
        return [
            'Web Application',
            'Mobile App',
            'Machine Learning',
            'Data Analysis',
            'API Development',
            'E-commerce',
            'Portfolio/Landing',
            'Other'
        ];
    }

    public static function getFeatured()
    {
        return self::active()
            ->featured()
            ->orderBy('sort_order')
            ->orderBy('completed_at', 'desc')
            ->get();
    }

    public static function getByCategory($category = null)
    {
        $query = self::active()->orderBy('sort_order')->orderBy('completed_at', 'desc');

        if ($category) {
            $query->byCategory($category);
        }

        return $query->get();
    }
}
