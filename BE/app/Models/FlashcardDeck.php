<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlashcardDeck extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'subject', 'icon', 'color',
        'visibility', 'owner_type', 'created_by', 'status', 'likes',
    ];

    public function cards()
    {
        return $this->hasMany(FlashcardCard::class, 'deck_id')->orderBy('order');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isOwnedBy(?User $user): bool
    {
        return $user && $this->created_by === $user->id;
    }
}
