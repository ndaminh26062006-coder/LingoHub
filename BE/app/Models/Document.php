<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Document = tài liệu trắc nghiệm (bộ câu hỏi theo môn/chương)
 * Bảng: documents (đổi tên từ exams cũ)
 */
class Document extends Model
{
    use HasFactory;

    protected $table = 'documents';

    protected $fillable = [
        'subject_id', 'title', 'chapter', 'description',
        'questions_count', 'duration', 'difficulty', 'type',
        'status', 'attempts', 'rating', 'created_by',
    ];

    protected $casts = [
        'attempts' => 'integer',
        'rating'   => 'float',
    ];

    public function subjectModel()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'document_id')->orderBy('order');
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
