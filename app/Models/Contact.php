<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
    ];

    protected $appends = [
        'formatted_created_at',
    ];

    // Accessor untuk format tanggal
    public function getFormattedCreatedAtAttribute()
    {
        return $this->created_at->format('M d, Y \a\t H:i');
    }

    // Method untuk mendapatkan pesan terbaru
    public static function getRecent($limit = 10)
    {
        return static::latest()->limit($limit)->get();
    }
}
