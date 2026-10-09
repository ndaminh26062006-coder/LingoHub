<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserExamAttempt extends Model
{
    use HasFactory;

    protected $table = 'user_exam_attempts';

    protected $fillable = [
        'user_id',
        'exam_id',
        'subject_id',
        'attempted_at',
    ];

    protected $casts = [
        'attempted_at' => 'datetime',
    ];

    /**
     * Get the user who attempted the exam
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the exam that was attempted
     */
    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    /**
     * Get the subject of the exam
     */
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}
