<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDocumentSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'document_id',
        'score', 'correct_count', 'total_questions', 'accuracy_percent',
        'time_spent_seconds', 'avg_time_per_question',
        'answered_count', 'skipped_count',
        'is_passed', 'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'score' => 'float',
        'accuracy_percent' => 'float',
        'avg_time_per_question' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}
