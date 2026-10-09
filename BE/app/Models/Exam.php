<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'subject_id', 'title', 'description',
        'chapter', 'questions_count', 'duration', 'type',
        'status', 'attempts', 'rating', 'created_by',
        'essay_questions_count', 'scenario_questions_count',
    ];

    protected $casts = [
        'attempts' => 'integer',
        'rating'   => 'float',
    ];

    public function subjectModel()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function examQuestions()
    {
        return $this->hasMany(ExamQuestion::class)->orderBy('order');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }
}
