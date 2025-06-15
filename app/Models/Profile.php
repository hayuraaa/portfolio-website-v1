<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'title',
        'bio',
        'description',
        'email',
        'phone',
        'location',
        'avatar',
        'cv_file',
        'github_url',
        'linkedin_url',
        'twitter_url',
        'instagram_url',
        'website_url',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = ['avatar_url', 'cv_url'];

    // Helper method to get the active profile
    public static function getActive()
    {
        return self::where('is_active', true)->first();
    }

    // Helper method to get avatar URL
    public function getAvatarUrlAttribute()
    {
        if ($this->avatar) {
            return asset('storage/' . $this->avatar);
        }
        return asset('images/default-avatar.svg');
    }

    // Helper method to get CV URL
    public function getCvUrlAttribute()
    {
        if ($this->cv_file) {
            return asset('storage/' . $this->cv_file);
        }
        return null;
    }
}