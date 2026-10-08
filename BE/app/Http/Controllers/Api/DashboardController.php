<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get authenticated user's dashboard data
     * GET /api/user/dashboard
     */
    public function dashboard(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Score history - last 14 days
        $scoreHistory = $user->userExamSubmissions()
            ->where('created_at', '>=', now()->subDays(14))
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($submission) {
                return [
                    'date' => $submission->completed_at->format('d/m'),
                    'score' => (float)$submission->score,
                    'label' => $this->getDayLabel($submission->completed_at),
                ];
            });

        // If less than 14 days of data, pad with zeros
        while ($scoreHistory->count() < 14) {
            $scoreHistory->prepend([
                'date' => now()->subDays(14 - $scoreHistory->count())->format('d/m'),
                'score' => 0,
                'label' => $this->getDayLabel(now()->subDays(14 - $scoreHistory->count())),
            ]);
        }

        // Subject progress - aggregate by subject
        $subjectStats = $this->getSubjectStats($user);

        // Recent exams - last 4 exams
        $recentExams = $user->userExamSubmissions()
            ->with('exam')
            ->orderByDesc('completed_at')
            ->limit(4)
            ->get()
            ->map(function ($submission) {
                $minutes = intval($submission->time_spent_seconds / 60);
                $hours = intval($minutes / 60);
                $mins = $minutes % 60;
                $timeStr = $hours > 0 ? "{$hours}h {$mins}m" : "{$mins} phút";

                return [
                    'id' => $submission->exam_id,
                    'title' => $submission->exam->title ?? 'Đề thi',
                    'score' => (float)$submission->score,
                    'total' => 10,
                    'date' => $submission->completed_at->format('d/m/Y'),
                    'time' => $timeStr,
                    'correct' => $submission->correct_count,
                    'wrong' => $submission->total_questions - $submission->correct_count,
                ];
            });

        // Achievements
        $achievements = $user->achievements()
            ->orderBy('unlocked_at', 'desc')
            ->get()
            ->map(function ($achievement) {
                return [
                    'id' => $achievement->id,
                    'icon' => $achievement->icon,
                    'title' => $achievement->title,
                    'desc' => $achievement->description,
                    'unlocked' => $achievement->unlocked_at !== null,
                    'color' => $achievement->color,
                ];
            });

        // Calculate readiness
        $readiness = $this->calculateReadiness($user);

        // Stat cards data
        $streak = $user->learningStreak;
        $avgScore = $user->userExamSubmissions()->avg('score') ?? 0;

        return response()->json([
            'stat_cards' => [
                [
                    'icon' => '📊',
                    'label' => 'Điểm TB',
                    'value' => round($avgScore, 1),
                    'sub' => $user->overall_accuracy > 0 ? "+{$user->overall_accuracy}% so với lần trước" : 'Chưa có dữ liệu',
                    'color' => '#1B3A6B',
                ],
                [
                    'icon' => '📝',
                    'label' => 'Câu đã luyện',
                    'value' => $user->userExamSubmissions()->sum('total_questions'),
                    'sub' => ($streak?->exams_completed_week ?? 0) . ' đề tuần này',
                    'color' => '#F5A623',
                ],
                [
                    'icon' => '',
                    'label' => 'Streak hiện tại',
                    'value' => ($streak?->current_streak_days ?? 0) . ' ngày',
                    'sub' => 'Kỷ lục cá nhân: ' . ($streak?->longest_streak_days ?? 0) . ' ngày',
                    'color' => '#ef4444',
                ],
                [
                    'icon' => '',
                    'label' => 'Đề đã hoàn thành',
                    'value' => $user->exams_completed,
                    'sub' => ($streak?->exams_completed_week ?? 0) . ' đề tuần này',
                    'color' => '#22c55e',
                ],
            ],
            'score_history' => $scoreHistory->values(),
            'avg_score' => round($avgScore, 1),
            'total_questions' => $user->userExamSubmissions()->sum('total_questions'),
            'streak' => $streak?->current_streak_days ?? 0,
            'readiness' => $readiness,
            'subject_stats' => $subjectStats,
            'recent_exams' => $recentExams,
            'achievements' => $achievements,
        ]);
    }

    /**
     * Calculate subject progress statistics
     */
    private function getSubjectStats(User $user): array
    {
        $submissions = $user->userExamSubmissions()
            ->with('exam.subject')
            ->get()
            ->groupBy('exam.subject.id');

        return $submissions->map(function ($subs, $subjectId) use ($submissions) {
            $avgScore = $subs->avg('score');
            $done = $subs->count();
            $total = 50; // Default target

            // Calculate trend (compare last week to previous week)
            $lastWeekSubs = $subs->filter(function ($s) {
                return $s->created_at->gte(now()->subWeeks(2)->startOfWeek())
                    && $s->created_at->lt(now()->subWeek()->startOfWeek());
            });
            $thisWeekSubs = $subs->filter(function ($s) {
                return $s->created_at->gte(now()->startOfWeek());
            });

            $lastWeekAvg = $lastWeekSubs->avg('score') ?? 0;
            $thisWeekAvg = $thisWeekSubs->avg('score') ?? 0;
            $trend = round($thisWeekAvg - $lastWeekAvg, 1);

            $subject = $subs->first()?->exam?->subject;
            $colors = ['#1B3A6B', '#F5A623', '#22c55e', '#8b5cf6', '#ef4444'];
            $colorIndex = $subjectId % count($colors);

            return [
                'name' => $subject?->name ?? 'Môn học',
                'done' => $done,
                'total' => $total,
                'avg' => round($avgScore, 1),
                'color' => $colors[$colorIndex],
                'trend' => ($trend >= 0 ? '+' : '') . $trend,
            ];
        })->values()->all();
    }

    /**
     * Calculate overall readiness percentage
     */
    private function calculateReadiness(User $user): int
    {
        $streak = $user->learningStreak;

        // Components: accuracy (30%), consistency (30%), speed (20%), volume (20%)
        $accuracyScore = min($user->overall_accuracy / 10, 10) * 30; // 0-30
        $consistencyScore = min(($streak?->current_streak_days ?? 0) / 7, 1) * 30; // 0-30
        
        // Speed: avg time per question, ideally <120 seconds
        $avgSpeed = $user->userExamSubmissions()->avg('avg_time_per_question') ?? 120;
        $speedScore = max(0, min(1 - ($avgSpeed / 240), 1)) * 20; // 0-20

        // Volume: exams completed this week (target: 5 exams)
        $weeklyExams = $streak?->exams_completed_week ?? 0;
        $volumeScore = min($weeklyExams / 5, 1) * 20; // 0-20

        $total = round($accuracyScore + $consistencyScore + $speedScore + $volumeScore);

        return min(max($total, 0), 100);
    }

    /**
     * Get day label (T2, T3, etc. for Vietnamese)
     */
    private function getDayLabel(Carbon $date): string
    {
        $day = $date->dayOfWeek; // 0 = Sunday, 1 = Monday
        $dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return $dayNames[$day];
    }
}
