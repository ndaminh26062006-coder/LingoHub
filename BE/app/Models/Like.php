<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Like extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'likeable_type',
        'likeable_id',
        'is_liked',
    ];

    protected $casts = [
        'is_liked' => 'boolean',
    ];

    /**
     * Get the owning likeable model
     */
    public function likeable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the user who made the like/dislike
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
