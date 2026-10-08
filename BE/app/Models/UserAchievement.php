<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAchievement extends Model
{
    protected $fillable = [
        'user_id',
        'achievement_key',
        'title',
        'description',
        'icon',
        'color',
        'unlocked_at',
        'progress',
    ];

    protected $casts = [
        'unlocked_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isUnlocked(): bool
    {
        return $this->unlocked_at !== null;
    }
}
