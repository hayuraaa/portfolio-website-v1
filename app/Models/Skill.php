<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'logo_url',
        'description',
        'sort_order',
        'is_featured',
        'is_active'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected $appends = ['logo_display_url'];

    // Scopes for filtering
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

    // Accessor for logo URL
    public function getLogoDisplayUrlAttribute()
    {
        if ($this->logo_url) {
            // If it's uploaded file
            if (strpos($this->logo_url, 'http') === false) {
                return asset('storage/' . $this->logo_url);
            }
            // If it's external URL
            return $this->logo_url;
        }
        return asset('images/default-tech-logo.svg');
    }

    // Get skills grouped by category
    public static function getGroupedByCategory()
    {
        return self::active()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->groupBy('category');
    }

    // Get featured skills
    public static function getFeatured()
    {
        return self::active()
            ->featured()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }
}
