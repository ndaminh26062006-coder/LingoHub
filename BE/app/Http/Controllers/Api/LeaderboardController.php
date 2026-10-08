<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserLearningStreak;
use Carbon\Carbon;

class LeaderboardController extends Controller
{
    /**
     * GET /api/leaderboard
     * Get leaderboard rankings by type
     * 
     * Query params:
     * - ranking_type: 'streak' | 'accuracy' | 'speed' (required)
     * - period: 'week' | 'month' | 'all' (default: 'week')
     * - limit: number (default: 7)
     */
    public function index(Request $request)
    {
        try {
            $rankingType = $request->query('ranking_type', 'streak');
            $period = $request->query('period', 'week');
            $limit = (int)$request->query('limit', 7);

            $query = User::query()
                ->where('status', 'active')
                ->where('role', '!=', 'admin')
                ->select('id', 'name', 'school', 'total_learning_hours', 'overall_accuracy', 'avg_speed_seconds', 'exams_completed');

            // Sort by ranking type
            if ($rankingType === 'accuracy') {
                $query->orderByDesc('overall_accuracy');
            } elseif ($rankingType === 'speed') {
                $query->orderBy('avg_speed_seconds');
            } else {
                $query->orderByDesc('total_learning_hours');
            }

            $users = $query->limit($limit)->get();

            // Map to leaderboard response format
            $rankings = $users->map(function ($user, $index) use ($rankingType, $period) {
                $displayValue = $this->getDisplayValue($user, $rankingType, $period);
                $subMetric = $this->getSubMetric($user, $rankingType, $period);

                return [
                    'rank' => $index + 1,
                    'user_id' => (int)$user->id,
                    'name' => (string)($user->name ?? ''),
                    'school' => (string)($user->school ?? ''),
                    'avatar_initials' => $this->getInitials($user->name),
                    'value' => $displayValue,
                    'total_hours' => (float)($user->total_learning_hours ?? 0),
                    'accuracy' => (float)($user->overall_accuracy ?? 0),
                    'avg_speed_seconds' => (float)($user->avg_speed_seconds ?? 0),
                    'exams_completed' => (int)($user->exams_completed ?? 0),
                    'sub_metric' => $subMetric,
                ];
            });

            return response()->json(
                [
                    'data' => $rankings->values()->all(),
                    'meta' => [
                        'ranking_type' => $rankingType,
                        'period' => $period,
                        'limit' => $limit,
                        'count' => $rankings->count(),
                        'updated_at' => now()->toIso8601String(),
                    ]
                ],
                200,
                [],
                JSON_UNESCAPED_UNICODE
            );
        } catch (\Exception $e) {
            \Log::error('Leaderboard error: ' . $e->getMessage());
            
            return response()->json(
                [
                    'data' => [],
                    'meta' => [
                        'ranking_type' => $request->query('ranking_type', 'streak'),
                        'period' => $request->query('period', 'week'),
                        'limit' => $request->query('limit', 7),
                        'count' => 0,
                        'updated_at' => now()->toIso8601String(),
                        'error' => 'No leaderboard data available',
                    ]
                ],
                200,
                [],
                JSON_UNESCAPED_UNICODE
            );
        }
    }

    /**
     * Format display value based on ranking type
     */
    private function getDisplayValue(User $user, string $rankingType, string $period): string
    {
        if ($rankingType === 'accuracy') {
            return round($user->overall_accuracy, 1) . '%';
        } elseif ($rankingType === 'speed') {
            return round($user->avg_speed_seconds, 0) . ' s/question';
        } else {
            return round($user->total_learning_hours, 0) . ' hours';
        }
    }

    /**
     * Format sub-metric for display
     */
    private function getSubMetric(User $user, string $rankingType, string $period): ?string
    {
        if ($rankingType === 'accuracy') {
            return 'Làm ' . ($user->exams_completed ?? 0) . ' đề';
        } elseif ($rankingType === 'speed') {
            return 'Tốc độ: ' . round($user->avg_speed_seconds ?? 0, 1) . 's/câu';
        } else {
            return 'Hoàn thành ' . ($user->exams_completed ?? 0) . ' đề';
        }
    }

    /**
     * Format hours for display
     */
    private function formatHours(float $hours): string
    {
        return round($hours, 0) . ' hours';
    }

    /**
     * Get average score from user submissions (stub - implement with actual data)
     */
    private function getAverageScore(User $user): float
    {
        $avgScore = $user->userExamSubmissions()
            ->avg('score');
        return $avgScore ?? 0;
    }

    /**
     * Get initials from name
     * "Nguyễn Minh Tuấn" -> "MT"
     */
    private function getInitials(string $name): string
    {
        $parts = explode(' ', trim($name));
        if (count($parts) >= 2) {
            return strtoupper(substr($parts[0], 0, 1) . substr(end($parts), 0, 1));
        }
        return strtoupper(substr($name, 0, 2));
    }
}
