<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserLearningStreak extends Model
{
    use HasFactory;

    protected $table = 'user_learning_streaks';

    protected $fillable = [
        'user_id',
        'total_hours', 'current_streak_days', 'last_activity_date', 'longest_streak_days',
        'hours_this_week', 'hours_this_month',
        'exams_completed_week', 'exams_completed_month',
        'overall_accuracy', 'avg_speed_seconds',
    ];

    protected $casts = [
        'last_activity_date' => 'date',
        'total_hours' => 'float',
        'hours_this_week' => 'float',
        'hours_this_month' => 'float',
        'overall_accuracy' => 'float',
        'avg_speed_seconds' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
