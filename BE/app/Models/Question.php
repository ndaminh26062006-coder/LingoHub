<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id', 'order', 'content', 'options',
        'correct_answer', 'explanation', 'difficulty',
    ];

    protected $casts = [
        'options' => 'array',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class, 'document_id');
    }
}
