<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'name', 'slug', 'icon', 'description', 'status', 'order',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
