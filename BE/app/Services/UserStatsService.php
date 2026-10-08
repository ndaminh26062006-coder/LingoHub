<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserExamSubmission;
use App\Models\UserLearningStreak;
use Carbon\Carbon;

class UserStatsService
{
    /**
     * Update user stats after a submission
     * Called from ExamController->submit()
     */
    public static function updateAfterSubmission(User $user, UserExamSubmission $submission): void
    {
        // Get or create learning streak record
        $streak = $user->learningStreak ?? $user->learningStreak()->create([
            'total_hours' => 0,
            'current_streak_days' => 0,
        ]);

        // Calculate time spent in hours (minimum 0.5 hours)
        $hoursSpent = max(0.5, $submission->time_spent_seconds / 3600);

        // Update user totals
        $user->increment('total_learning_hours', $hoursSpent);
        $user->increment('exams_completed');
        $user->update(['last_exam_date' => now()]);

        // Recalculate overall accuracy
        $avgAccuracy = $user->userExamSubmissions()->avg('accuracy_percent') ?? 0;
        $user->update(['overall_accuracy' => round($avgAccuracy, 2)]);

        // Recalculate average speed
        $avgSpeed = $user->userExamSubmissions()
            ->whereNotNull('avg_time_per_question')
            ->avg('avg_time_per_question') ?? 0;
        $user->update(['avg_speed_seconds' => round($avgSpeed, 2)]);

        // Update learning streak
        self::updateStreak($user, $streak, $hoursSpent);
    }

    /**
     * Update user stats after a document submission
     * (Same as exam submission - uses same stats)
     */
    public static function updateAfterDocumentSubmission(User $user, $submission): void
    {
        // Get or create learning streak record
        $streak = $user->learningStreak ?? $user->learningStreak()->create([
            'total_hours' => 0,
            'current_streak_days' => 0,
        ]);

        // Calculate time spent in hours (minimum 0.5 hours)
        $hoursSpent = max(0.5, $submission->time_spent_seconds / 3600);

        // Update user totals
        $user->increment('total_learning_hours', $hoursSpent);
        $user->increment('exams_completed');
        $user->update(['last_exam_date' => now()]);

        // Recalculate overall accuracy (from both exam and document submissions)
        $avgAccuracy = collect([
            $user->userExamSubmissions()->avg('accuracy_percent'),
            $user->userDocumentSubmissions()->avg('accuracy_percent'),
        ])->filter()->avg() ?? 0;
        $user->update(['overall_accuracy' => round($avgAccuracy, 2)]);

        // Recalculate average speed (from both exam and document submissions)
        $avgSpeed = collect([
            $user->userExamSubmissions()->whereNotNull('avg_time_per_question')->avg('avg_time_per_question'),
            $user->userDocumentSubmissions()->whereNotNull('avg_time_per_question')->avg('avg_time_per_question'),
        ])->filter()->avg() ?? 0;
        $user->update(['avg_speed_seconds' => round($avgSpeed, 2)]);

        // Update learning streak
        self::updateStreak($user, $streak, $hoursSpent);
    }

    /**
     * Update user's learning streak and weekly/monthly aggregates
     */
    private static function updateStreak(User $user, UserLearningStreak $streak, float $hoursSpent): void
    {
        $today = now()->toDateString();
        $lastActivity = $streak->last_activity_date ? $streak->last_activity_date->toDateString() : null;

        // Calculate new streak
        if ($lastActivity === $today) {
            // Same day, just add hours
            $newCurrentStreak = $streak->current_streak_days;
        } elseif ($lastActivity === now()->subDay()->toDateString()) {
            // Consecutive day
            $newCurrentStreak = $streak->current_streak_days + 1;
        } else {
            // Streak broken or first day
            $newCurrentStreak = 1;
        }

        // Update longest streak
        $newLongestStreak = max($streak->longest_streak_days ?? 0, $newCurrentStreak);

        // Calculate weekly/monthly aggregates (from both exam and document submissions)
        $weekStart = now()->startOfWeek()->toDateString();
        $monthStart = now()->startOfMonth()->toDateString();
        
        $examHoursThisWeek = $user->userExamSubmissions()
            ->where('created_at', '>=', $weekStart)
            ->sum('time_spent_seconds') / 3600;
        
        $docHoursThisWeek = $user->userDocumentSubmissions()
            ->where('created_at', '>=', $weekStart)
            ->sum('time_spent_seconds') / 3600;
            
        $hoursThisWeek = $examHoursThisWeek + $docHoursThisWeek;
        
        $examHoursThisMonth = $user->userExamSubmissions()
            ->where('created_at', '>=', $monthStart)
            ->sum('time_spent_seconds') / 3600;
        
        $docHoursThisMonth = $user->userDocumentSubmissions()
            ->where('created_at', '>=', $monthStart)
            ->sum('time_spent_seconds') / 3600;
            
        $hoursThisMonth = $examHoursThisMonth + $docHoursThisMonth;

        $examsThisWeek = $user->userExamSubmissions()
            ->where('created_at', '>=', $weekStart)
            ->count() + $user->userDocumentSubmissions()
            ->where('created_at', '>=', $weekStart)
            ->count();

        $examsThisMonth = $user->userExamSubmissions()
            ->where('created_at', '>=', $monthStart)
            ->count() + $user->userDocumentSubmissions()
            ->where('created_at', '>=', $monthStart)
            ->count();

        // Update streak record with safe defaults for NULL values
        $updateData = [
            'total_hours' => $streak->total_hours + $hoursSpent,
            'current_streak_days' => $newCurrentStreak,
            'longest_streak_days' => $newLongestStreak,
            'last_activity_date' => $today,
            'hours_this_week' => $hoursThisWeek,
            'hours_this_month' => $hoursThisMonth,
            'exams_completed_week' => $examsThisWeek,
            'exams_completed_month' => $examsThisMonth,
            'overall_accuracy' => $user->overall_accuracy ?? 0,
            'avg_speed_seconds' => $user->avg_speed_seconds ?? 0,
        ];
        
        $streak->update($updateData);
    }

    /**
     * Get user's leaderboard rank for a specific metric
     * 
     * @param User $user
     * @param string $metric 'streak', 'accuracy', or 'speed'
     * @return int Rank (1 = first place)
     */
    public static function getUserRank(User $user, string $metric): int
    {
        $query = User::query()
            ->where('status', 'active')
            ->where('id', '!=', $user->id);

        $rank = match ($metric) {
            'accuracy' => $query->where('overall_accuracy', '>', $user->overall_accuracy)->count() + 1,
            'speed' => $query->where('avg_speed_seconds', '<', $user->avg_speed_seconds)->count() + 1,
            default => $query->where('total_learning_hours', '>', $user->total_learning_hours)->count() + 1,
        };

        return $rank;
    }

    /**
     * Get user's full stats object
     * 
     * @param User $user
     * @return array User stats including rankings
     */
    public static function getUserStats(User $user): array
    {
        $streak = $user->learningStreak ?? $user->learningStreak()->create([
            'total_hours' => 0,
            'current_streak_days' => 0,
        ]);

        return [
            'user_id' => $user->id,
            'name' => $user->name,
            'school' => $user->school,
            
            // Time-based metrics
            'total_hours' => $user->total_learning_hours,
            'current_streak_days' => $streak->current_streak_days,
            'longest_streak_days' => $streak->longest_streak_days,
            'last_activity_date' => $streak->last_activity_date,
            
            // Performance metrics
            'overall_accuracy' => $user->overall_accuracy,
            'avg_speed_seconds' => $user->avg_speed_seconds,
            'exams_completed' => $user->exams_completed,
            
            // Weekly/monthly
            'hours_this_week' => $streak->hours_this_week,
            'hours_this_month' => $streak->hours_this_month,
            'exams_this_week' => $streak->exams_completed_week,
            'exams_this_month' => $streak->exams_completed_month,
            
            // Rankings
            'rankings' => [
                'streak_rank' => self::getUserRank($user, 'streak'),
                'accuracy_rank' => self::getUserRank($user, 'accuracy'),
                'speed_rank' => self::getUserRank($user, 'speed'),
            ],
            
            // Recent submissions
            'recent_submissions' => $user->userExamSubmissions()
                ->orderByDesc('created_at')
                ->limit(5)
                ->get()
                ->map(fn ($sub) => [
                    'exam_id' => $sub->exam_id,
                    'exam_title' => $sub->exam?->title ?? 'N/A',
                    'score' => $sub->score,
                    'accuracy' => $sub->accuracy_percent,
                    'time_seconds' => $sub->time_spent_seconds,
                    'submitted_at' => $sub->completed_at->toIso8601String(),
                ]),
        ];
    }

    /**
     * Get top users for a specific ranking metric
     * 
     * @param string $metric 'streak', 'accuracy', 'speed'
     * @param string $period 'week', 'month', 'all'
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getTopUsers(string $metric, string $period = 'all', int $limit = 10)
    {
        $query = User::query()
            ->where('status', 'active')
            ->with('learningStreak');

        // Apply time period filter if needed
        if ($period !== 'all') {
            $startDate = $period === 'week' 
                ? now()->startOfWeek() 
                : now()->startOfMonth();
            
            $query->whereHas('userExamSubmissions', function ($q) use ($startDate) {
                $q->where('created_at', '>=', $startDate);
            });
        }

        // Sort by metric
        $query = match ($metric) {
            'accuracy' => $query->orderByDesc('overall_accuracy'),
            'speed' => $query->orderBy('avg_speed_seconds'),
            default => $query->orderByDesc('total_learning_hours'), // streak
        };

        return $query->limit($limit)->get();
    }

    /**
     * Reset user stats (admin only)
     */
    public static function resetUserStats(User $user): void
    {
        // Delete all submissions
        $user->userExamSubmissions()->delete();

        // Delete streak record
        $user->learningStreak?->delete();

        // Reset user fields
        $user->update([
            'total_learning_hours' => 0,
            'overall_accuracy' => 0,
            'avg_speed_seconds' => 0,
            'exams_completed' => 0,
            'last_exam_date' => null,
        ]);
    }
}
