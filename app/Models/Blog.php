<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'tags',
        'category',
        'status',
        'is_featured',
        'read_time',
        'views_count',
        'published_at',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'sort_order'
    ];

    protected $casts = [
        'tags' => 'array',
        'meta_keywords' => 'array',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
        'views_count' => 'integer',
        'read_time' => 'integer',
        'sort_order' => 'integer'
    ];

    protected $appends = ['featured_image_url', 'formatted_published_at', 'status_label'];

    // Boot method untuk auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($blog) {
            if (empty($blog->slug)) {
                $blog->slug = static::generateUniqueSlug($blog->title);
            }

            // Auto calculate read time
            if (empty($blog->read_time)) {
                $blog->read_time = static::calculateReadTime($blog->content);
            }

            // Set published_at if status is published and published_at is null
            if ($blog->status === 'published' && !$blog->published_at) {
                $blog->published_at = now();
            }
        });

        static::updating(function ($blog) {
            if ($blog->isDirty('title')) {
                $blog->slug = static::generateUniqueSlug($blog->title, $blog->id);
            }

            if ($blog->isDirty('content')) {
                $blog->read_time = static::calculateReadTime($blog->content);
            }

            // Set published_at when changing from draft to published
            if ($blog->isDirty('status') && $blog->status === 'published' && !$blog->published_at) {
                $blog->published_at = now();
            }
        });
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->where('published_at', '<=', now());
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByTag($query, $tag)
    {
        return $query->whereJsonContains('tags', $tag);
    }

    public function scopeRecent($query, $limit = 5)
    {
        return $query->published()
            ->orderBy('published_at', 'desc')
            ->limit($limit);
    }

    public function scopePopular($query, $limit = 5)
    {
        return $query->published()
            ->orderBy('views_count', 'desc')
            ->limit($limit);
    }

    // Accessors
    public function getFeaturedImageUrlAttribute()
    {
        if ($this->featured_image) {
            if (filter_var($this->featured_image, FILTER_VALIDATE_URL)) {
                return $this->featured_image; // External URL
            }
            return asset('storage/' . $this->featured_image); // Local file
        }
        return asset('images/default-blog.svg');
    }

    public function getFormattedPublishedAtAttribute()
    {
        if ($this->published_at) {
            return $this->published_at->format('M d, Y');
        }
        return null;
    }

    public function getStatusLabelAttribute()
    {
        return match ($this->status) {
            'draft' => 'Draft',
            'published' => 'Published',
            'archived' => 'Archived',
            default => 'Unknown'
        };
    }

    // Helper methods
    public static function generateUniqueSlug($title, $excludeId = null)
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (static::slugExists($slug, $excludeId)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private static function slugExists($slug, $excludeId = null)
    {
        $query = static::where('slug', $slug);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    public static function calculateReadTime($content)
    {
        $wordCount = str_word_count(strip_tags($content));
        $wordsPerMinute = 200; // Average reading speed
        return max(1, ceil($wordCount / $wordsPerMinute));
    }

    public function incrementViews()
    {
        $this->increment('views_count');
    }

    // Static methods untuk categories dan status
    public static function getCategories()
    {
        return [
            'Technology',
            'Web Development',
            'Mobile Development',
            'Machine Learning',
            'Data Science',
            'DevOps',
            'Programming',
            'Tutorial',
            'Review',
            'News',
            'Personal',
            'General'
        ];
    }

    public static function getStatuses()
    {
        return [
            'draft' => 'Draft',
            'published' => 'Published',
            'archived' => 'Archived'
        ];
    }

    // Get popular tags
    public static function getPopularTags($limit = 20)
    {
        $blogs = static::published()->whereNotNull('tags')->get();
        $allTags = [];

        foreach ($blogs as $blog) {
            if ($blog->tags) {
                $allTags = array_merge($allTags, $blog->tags);
            }
        }

        $tagCounts = array_count_values($allTags);
        arsort($tagCounts);

        return array_slice(array_keys($tagCounts), 0, $limit);
    }

    // Get related blogs
    public function getRelatedBlogs($limit = 3)
    {
        $relatedByCategory = static::published()
            ->where('id', '!=', $this->id)
            ->where('category', $this->category)
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();

        if ($relatedByCategory->count() < $limit && $this->tags) {
            $needed = $limit - $relatedByCategory->count();
            $relatedByTags = static::published()
                ->where('id', '!=', $this->id)
                ->where('category', '!=', $this->category)
                ->where(function ($query) {
                    foreach ($this->tags as $tag) {
                        $query->orWhereJsonContains('tags', $tag);
                    }
                })
                ->orderBy('published_at', 'desc')
                ->limit($needed)
                ->get();

            return $relatedByCategory->merge($relatedByTags);
        }

        return $relatedByCategory;
    }
}
