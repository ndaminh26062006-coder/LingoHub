<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\UserExamSubmission;
use App\Models\UserLearningStreak;
use Carbon\Carbon;

class LeaderboardTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 10 test users
        $users = [
            ['name' => 'Nguyễn Minh Tuấn', 'school' => 'ĐH Kinh tế TP.HCM'],
            ['name' => 'Trần Thị Lan Anh', 'school' => 'ĐH Bách Khoa HN'],
            ['name' => 'Phạm Đức Hùng', 'school' => 'ĐH Ngoại Thương'],
            ['name' => 'Lê Thị Thu Hà', 'school' => 'ĐH Luật TP.HCM'],
            ['name' => 'Vũ Hoàng Nam', 'school' => 'ĐH CNTT TP.HCM'],
            ['name' => 'Đặng Thị Bích Ngọc', 'school' => 'ĐH Khoa học XH&NV'],
            ['name' => 'Hoàng Văn Khánh', 'school' => 'ĐH Sư phạm TP.HCM'],
            ['name' => 'Bùi Thị Thanh Mai', 'school' => 'ĐH Y Dược TP.HCM'],
            ['name' => 'Lê Hoàng Phúc', 'school' => 'ĐH FPT'],
            ['name' => 'Ngô Thị Kim Dung', 'school' => 'ĐH Văn Lang'],
        ];

        $createdUsers = [];
        foreach ($users as $userData) {
            $user = User::firstOrCreate(
                ['email' => strtolower(str_replace(' ', '.', $userData['name'])) . '@test.com'],
                [
                    'name' => $userData['name'],
                    'school' => $userData['school'],
                    'password' => bcrypt('password'),
                    'status' => 'active',
                ]
            );
            
            // Create learning streak record
            $user->learningStreak()->firstOrCreate(['user_id' => $user->id]);
            
            $createdUsers[] = $user;
        }

        // Get or create a test exam
        $exam = Exam::firstOrCreate(
            ['id' => 1],
            [
                'subject_id' => 1,
                'title' => 'Test Exam',
                'questions_count' => 20,
                'duration' => 60,
                'status' => 'published',
            ]
        );

        // Create exam questions if they don't exist
        if ($exam->examQuestions()->count() === 0) {
            for ($i = 1; $i <= 20; $i++) {
                ExamQuestion::create([
                    'exam_id' => $exam->id,
                    'order' => $i,
                    'content' => "Question $i",
                    'options' => [
                        ['id' => 'A', 'text' => "Option A$i"],
                        ['id' => 'B', 'text' => "Option B$i"],
                        ['id' => 'C', 'text' => "Option C$i"],
                        ['id' => 'D', 'text' => "Option D$i"],
                    ],
                    'correct_answer' => 'A',
                    'explanation' => "Explanation for Q$i",
                ]);
            }
        }

        // Generate test submissions for each user
        $this->generateSubmissions($createdUsers, $exam);
    }

    /**
     * Generate realistic submissions for test users
     */
    private function generateSubmissions($users, $exam): void
    {
        // Define performance profiles for each user
        $profiles = [
            0 => ['hours' => 142, 'accuracy' => 92, 'speed' => 45],     // Tuấn - high hours
            1 => ['hours' => 128, 'accuracy' => 97, 'speed' => 38],     // Lan Anh - high accuracy
            2 => ['hours' => 115, 'accuracy' => 88, 'speed' => 52],     // Hùng - mid
            3 => ['hours' => 98, 'accuracy' => 85, 'speed' => 60],      // Thu Hà - mid
            4 => ['hours' => 87, 'accuracy' => 90, 'speed' => 42],      // Nam - mid
            5 => ['hours' => 76, 'accuracy' => 82, 'speed' => 65],      // Bích Ngọc - lower
            6 => ['hours' => 64, 'accuracy' => 79, 'speed' => 70],      // Khánh - lower
            7 => ['hours' => 95, 'accuracy' => 94, 'speed' => 40],      // Mai - high accuracy
            8 => ['hours' => 110, 'accuracy' => 89, 'speed' => 38],     // Phúc - fast
            9 => ['hours' => 82, 'accuracy' => 91, 'speed' => 48],      // Dung - balanced
        ];

        foreach ($users as $idx => $user) {
            $profile = $profiles[$idx] ?? ['hours' => 50, 'accuracy' => 75, 'speed' => 60];
            
            // Generate multiple submissions to reach target hours
            $totalHours = 0;
            $submissionCount = 0;
            $targetHours = $profile['hours'];
            
            while ($totalHours < $targetHours && $submissionCount < 50) {
                // Realistic time per submission (30-90 minutes)
                $timeSpent = rand(1800, 5400);
                $hoursAdded = $timeSpent / 3600;
                $totalHours += $hoursAdded;
                
                // Generate score based on accuracy profile (with some variance)
                $baseAccuracy = $profile['accuracy'];
                $variance = rand(-10, 10);
                $actualAccuracy = max(0, min(100, $baseAccuracy + $variance));
                
                // Calculate correct answers
                $totalQuestions = 20;
                $correctCount = round(($actualAccuracy / 100) * $totalQuestions);
                $score = round(($correctCount / $totalQuestions) * 10, 1);
                
                // Create submission
                $submission = UserExamSubmission::create([
                    'user_id' => $user->id,
                    'exam_id' => $exam->id,
                    'score' => $score,
                    'correct_count' => $correctCount,
                    'total_questions' => $totalQuestions,
                    'accuracy_percent' => $actualAccuracy,
                    'time_spent_seconds' => $timeSpent,
                    'avg_time_per_question' => round($timeSpent / $totalQuestions, 2),
                    'answered_count' => $totalQuestions,
                    'skipped_count' => 0,
                    'mode' => 'exam',
                    'is_passed' => $score >= 5.0,
                    'completed_at' => now()->subDays(rand(0, 30)),
                ]);
                
                // Update user stats
                $user->increment('total_learning_hours', $hoursAdded);
                $user->increment('exams_completed');
                $user->update(['last_exam_date' => now()]);
                
                $submissionCount++;
            }
            
            // Recalculate final stats
            $this->recalculateUserStats($user);
        }
    }

    /**
     * Recalculate user's aggregate stats from submissions
     */
    private function recalculateUserStats(User $user): void
    {
        $submissions = $user->userExamSubmissions()->get();
        
        if ($submissions->isEmpty()) {
            return;
        }

        // Calculate averages
        $avgAccuracy = $submissions->avg('accuracy_percent');
        $avgSpeed = $submissions->avg('avg_time_per_question');
        $totalHours = $submissions->sum('time_spent_seconds') / 3600;

        // Update user
        $user->update([
            'total_learning_hours' => round($totalHours, 2),
            'overall_accuracy' => round($avgAccuracy, 2),
            'avg_speed_seconds' => round($avgSpeed, 2),
            'exams_completed' => $submissions->count(),
        ]);

        // Update streak
        $streak = $user->learningStreak;
        $streak->update([
            'total_hours' => round($totalHours, 2),
            'overall_accuracy' => round($avgAccuracy, 2),
            'avg_speed_seconds' => round($avgSpeed, 2),
            'exams_completed_week' => $submissions->where('created_at', '>=', now()->startOfWeek())->count(),
            'exams_completed_month' => $submissions->where('created_at', '>=', now()->startOfMonth())->count(),
            'hours_this_week' => $submissions->where('created_at', '>=', now()->startOfWeek())->sum('time_spent_seconds') / 3600,
            'hours_this_month' => $submissions->where('created_at', '>=', now()->startOfMonth())->sum('time_spent_seconds') / 3600,
        ]);
    }
}
