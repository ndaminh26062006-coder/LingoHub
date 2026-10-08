<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamQuestion extends Model
{
    protected $table = 'exam_questions';

    protected $fillable = [
        'exam_id', 'order', 'type', 'content', 'options',
        'correct_answer', 'explanation', 'difficulty', 'sub_questions',
    ];

    protected $casts = ['options' => 'array', 'sub_questions' => 'array'];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }
}
