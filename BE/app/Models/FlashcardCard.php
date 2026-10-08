<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlashcardCard extends Model
{
    use HasFactory;

    protected $fillable = ['deck_id', 'front', 'back', 'subject', 'order'];

    public function deck()
    {
        return $this->belongsTo(FlashcardDeck::class, 'deck_id');
    }
}
