<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EssayQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject_id', 'title', 'chapter', 'question',
        'hint', 'sample_answer', 'time_limit',
        'difficulty', 'status', 'attempts', 'created_by',
    ];

    public function subjectModel()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
