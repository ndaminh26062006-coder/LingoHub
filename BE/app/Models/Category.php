<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug', 'name', 'icon', 'color', 'description', 'status', 'order',
    ];

    public function essayQuestions()
    {
        return $this->hasMany(EssayQuestion::class);
    }

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }
}
