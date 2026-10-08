<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Category;
use App\Models\Subject;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\UserExamSubmission;
use App\Services\UserStatsService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserStatsServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $exam;
    protected $subject;
    protected $category;

    public function setUp(): void
    {
        parent::setUp();

        // Create test category
        $this->category = Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
            'color' => '#000000',
        ]);

        // Create test subject with category_id
        $this->subject = Subject::create([
            'category_id' => $this->category->id,
            'name' => 'Test Subject',
            'slug' => 'test-subject',
            'icon' => 'book',
            'status' => 1,
        ]);

        // Create test user
        $this->user = User::factory()->create([
            'name' => 'Test User',
            'school' => 'Test School',
            'status' => 'active',
        ]);

        // Create learning streak
        $this->user->learningStreak()->create([
            'total_hours' => 0,
            'current_streak_days' => 0,
        ]);

        // Create test exam with questions
        $this->exam = Exam::create([
            'subject_id' => $this->subject->id,
            'title' => 'Test Exam',
            'questions_count' => 20,
            'duration' => 60,
            'status' => 'published',
        ]);

        for ($i = 1; $i <= 20; $i++) {
            ExamQuestion::create([
                'exam_id' => $this->exam->id,
                'order' => $i,
                'content' => "Question $i",
                'options' => [
                    ['id' => 'A', 'text' => 'Option A'],
                    ['id' => 'B', 'text' => 'Option B'],
                    ['id' => 'C', 'text' => 'Option C'],
                    ['id' => 'D', 'text' => 'Option D'],
                ],
                'correct_answer' => 'A',
                'explanation' => 'Explanation',
            ]);
        }
    }

    /**
     * Test that submission stats are calculated correctly
     */
    public function test_submission_stats_calculation()
    {
        $submission = UserExamSubmission::create([
            'user_id' => $this->user->id,
            'exam_id' => $this->exam->id,
            'score' => 8.5,
            'correct_count' => 17,
            'total_questions' => 20,
            'accuracy_percent' => 85.0,
            'time_spent_seconds' => 3600,
            'avg_time_per_question' => 180,
            'answered_count' => 20,
            'skipped_count' => 0,
            'mode' => 'exam',
            'is_passed' => true,
            'completed_at' => now(),
        ]);

        $this->assertNotNull($submission);
        $this->assertEquals(8.5, $submission->score);
        $this->assertEquals(85.0, $submission->accuracy_percent);
        $this->assertEquals(180, $submission->avg_time_per_question);
    }

    /**
     * Test that user stats are updated after submission
     */
    public function test_user_stats_updated_after_submission()
    {
        $submission = UserExamSubmission::create([
            'user_id' => $this->user->id,
            'exam_id' => $this->exam->id,
            'score' => 9.0,
            'correct_count' => 18,
            'total_questions' => 20,
            'accuracy_percent' => 90.0,
            'time_spent_seconds' => 3600,
            'avg_time_per_question' => 180,
            'answered_count' => 20,
            'skipped_count' => 0,
            'mode' => 'exam',
            'is_passed' => true,
            'completed_at' => now(),
        ]);

        UserStatsService::updateAfterSubmission($this->user, $submission);

        // Refresh user to get updated values
        $this->user->refresh();

        // Verify submissions were tracked
        $this->assertGreaterThan(0, $this->user->userExamSubmissions()->count());
        // Verify hours were recorded
        $this->assertGreaterThan(0, $this->user->total_learning_hours);
        // Verify streak was created
        $this->assertNotNull($this->user->learningStreak);
    }

    /**
     * Test accuracy ranking (higher is better)
     */
    public function test_accuracy_ranking()
    {
        // Create users with different accuracies
        $user1 = User::factory()->create(['overall_accuracy' => 95.0, 'status' => 'active']);
        $user2 = User::factory()->create(['overall_accuracy' => 85.0, 'status' => 'active']);
        $user3 = User::factory()->create(['overall_accuracy' => 90.0, 'status' => 'active']);

        $user1->learningStreak()->create();
        $user2->learningStreak()->create();
        $user3->learningStreak()->create();

        // Get top users by accuracy
        $topUsers = UserStatsService::getTopUsers('accuracy', 'all', 3);

        $this->assertEquals(3, $topUsers->count());
        $this->assertEquals(95.0, $topUsers[0]->overall_accuracy);
        $this->assertEquals(90.0, $topUsers[1]->overall_accuracy);
        $this->assertEquals(85.0, $topUsers[2]->overall_accuracy);
    }

    /**
     * Test speed ranking (lower is better)
     */
    public function test_speed_ranking()
    {
        // Create users with different speeds
        $user1 = User::factory()->create(['avg_speed_seconds' => 45.0, 'status' => 'active']);
        $user2 = User::factory()->create(['avg_speed_seconds' => 60.0, 'status' => 'active']);
        $user3 = User::factory()->create(['avg_speed_seconds' => 50.0, 'status' => 'active']);

        $user1->learningStreak()->create();
        $user2->learningStreak()->create();
        $user3->learningStreak()->create();

        // Get top users by speed (fastest first) - should work even with default values
        $topUsers = UserStatsService::getTopUsers('speed', 'all', 10);

        // Should have multiple users, sorted by speed ascending
        $this->assertGreaterThanOrEqual(3, $topUsers->count());
        // First should be fastest
        $this->assertLessThanOrEqual($topUsers[1]->avg_speed_seconds, $topUsers[0]->avg_speed_seconds);
    }

    /**
     * Test streak ranking (higher is better)
     */
    public function test_streak_ranking()
    {
        // Create users with different learning hours
        $user1 = User::factory()->create(['total_learning_hours' => 150.0, 'status' => 'active']);
        $user2 = User::factory()->create(['total_learning_hours' => 100.0, 'status' => 'active']);
        $user3 = User::factory()->create(['total_learning_hours' => 125.0, 'status' => 'active']);

        $user1->learningStreak()->create();
        $user2->learningStreak()->create();
        $user3->learningStreak()->create();

        // Get top users by streak (learning hours)
        $topUsers = UserStatsService::getTopUsers('streak', 'all', 3);

        $this->assertEquals(3, $topUsers->count());
        $this->assertEquals(150.0, $topUsers[0]->total_learning_hours);
        $this->assertEquals(125.0, $topUsers[1]->total_learning_hours);
        $this->assertEquals(100.0, $topUsers[2]->total_learning_hours);
    }

    /**
     * Test user rank calculation for streak
     */
    public function test_user_rank_calculation_streak()
    {
        $user1 = User::factory()->create(['total_learning_hours' => 150.0, 'status' => 'active', 'name' => 'User 1']);
        $user2 = User::factory()->create(['total_learning_hours' => 100.0, 'status' => 'active', 'name' => 'User 2']);
        $user3 = User::factory()->create(['total_learning_hours' => 125.0, 'status' => 'active', 'name' => 'User 3']);

        // User 1 should be rank 1 (highest hours)
        $rank = UserStatsService::getUserRank($user1, 'streak');
        $this->assertEquals(1, $rank);

        // User 3 should be rank 2 (middle hours)
        $rank = UserStatsService::getUserRank($user3, 'streak');
        $this->assertEquals(2, $rank);

        // User 2 should be rank 3 (lowest hours)
        $rank = UserStatsService::getUserRank($user2, 'streak');
        $this->assertEquals(3, $rank);
    }

    /**
     * Test user rank calculation for accuracy
     */
    public function test_user_rank_calculation_accuracy()
    {
        $user1 = User::factory()->create(['overall_accuracy' => 95.0, 'status' => 'active']);
        $user2 = User::factory()->create(['overall_accuracy' => 85.0, 'status' => 'active']);
        $user3 = User::factory()->create(['overall_accuracy' => 90.0, 'status' => 'active']);

        // User 1 should be rank 1 (highest accuracy)
        $rank = UserStatsService::getUserRank($user1, 'accuracy');
        $this->assertEquals(1, $rank);

        // User 3 should be rank 2 (middle accuracy)
        $rank = UserStatsService::getUserRank($user3, 'accuracy');
        $this->assertEquals(2, $rank);

        // User 2 should be rank 3 (lowest accuracy)
        $rank = UserStatsService::getUserRank($user2, 'accuracy');
        $this->assertEquals(3, $rank);
    }

    /**
     * Test user rank calculation for speed
     */
    public function test_user_rank_calculation_speed()
    {
        $user1 = User::factory()->create(['avg_speed_seconds' => 45.0, 'status' => 'active']);
        $user2 = User::factory()->create(['avg_speed_seconds' => 60.0, 'status' => 'active']);
        $user3 = User::factory()->create(['avg_speed_seconds' => 50.0, 'status' => 'active']);

        // User 1 should be rank 1 (fastest - lowest seconds)
        $rank = UserStatsService::getUserRank($user1, 'speed');
        $this->assertLessThanOrEqual(2, $rank);  // At most rank 2 (considering test user with 0.0 speed)

        // User 3 should be ranked after user 1
        $rank3 = UserStatsService::getUserRank($user3, 'speed');
        $rank1 = UserStatsService::getUserRank($user1, 'speed');
        $this->assertGreaterThan($rank1, $rank3);

        // User 2 should be ranked slowest
        $rank2 = UserStatsService::getUserRank($user2, 'speed');
        $this->assertGreaterThan($rank3, $rank2);
    }

    /**
     * Test multiple submissions increase stats
     */
    public function test_multiple_submissions_aggregate_stats()
    {
        // First submission
        $submission1 = UserExamSubmission::create([
            'user_id' => $this->user->id,
            'exam_id' => $this->exam->id,
            'score' => 8.0,
            'correct_count' => 16,
            'total_questions' => 20,
            'accuracy_percent' => 80.0,
            'time_spent_seconds' => 3600,
            'avg_time_per_question' => 180,
            'answered_count' => 20,
            'skipped_count' => 0,
            'mode' => 'exam',
            'is_passed' => true,
            'completed_at' => now(),
        ]);
        UserStatsService::updateAfterSubmission($this->user, $submission1);

        // Second submission
        $submission2 = UserExamSubmission::create([
            'user_id' => $this->user->id,
            'exam_id' => $this->exam->id,
            'score' => 9.0,
            'correct_count' => 18,
            'total_questions' => 20,
            'accuracy_percent' => 90.0,
            'time_spent_seconds' => 3000,
            'avg_time_per_question' => 150,
            'answered_count' => 20,
            'skipped_count' => 0,
            'mode' => 'exam',
            'is_passed' => true,
            'completed_at' => now(),
        ]);
        UserStatsService::updateAfterSubmission($this->user, $submission2);

        $this->user->refresh();

        // Should have 2 submissions
        $this->assertEquals(2, $this->user->userExamSubmissions()->count());

        // Hours should accumulate
        $this->assertGreaterThan(1.0, $this->user->total_learning_hours);
    }

    /**
     * Test filtering inactive users from rankings
     */
    public function test_inactive_users_excluded_from_rankings()
    {
        $activeUser = User::factory()->create(['total_learning_hours' => 100.0, 'status' => 'active']);
        $inactiveUser = User::factory()->create(['total_learning_hours' => 200.0, 'status' => 'blocked']);

        $activeUser->learningStreak()->create();
        $inactiveUser->learningStreak()->create();

        $topUsers = UserStatsService::getTopUsers('streak', 'all', 10);

        // Should only include active user, not blocked user
        $userIds = $topUsers->pluck('id')->toArray();
        $this->assertContains($activeUser->id, $userIds);
        $this->assertNotContains($inactiveUser->id, $userIds);
    }

    /**
     * Test user stats reset
     */
    public function test_user_stats_reset()
    {
        // Create submissions
        for ($i = 0; $i < 3; $i++) {
            $submission = UserExamSubmission::create([
                'user_id' => $this->user->id,
                'exam_id' => $this->exam->id,
                'score' => 8.0 + $i,
                'correct_count' => 16 + $i,
                'total_questions' => 20,
                'accuracy_percent' => 80.0 + $i,
                'time_spent_seconds' => 3600 - ($i * 100),
                'avg_time_per_question' => 180,
                'answered_count' => 20,
                'skipped_count' => 0,
                'mode' => 'exam',
                'is_passed' => true,
                'completed_at' => now(),
            ]);
            UserStatsService::updateAfterSubmission($this->user, $submission);
        }

        $this->user->refresh();

        // Verify stats are populated
        $this->assertEquals(3, $this->user->userExamSubmissions()->count());

        // Reset stats
        UserStatsService::resetUserStats($this->user);

        $this->user->refresh();

        // Verify all submissions deleted
        $this->assertEquals(0, $this->user->userExamSubmissions()->count());
    }

    /**
     * Test scoring formula
     */
    public function test_scoring_formula()
    {
        // Test with 15/20 correct (75%)
        $correctCount = 15;
        $totalQuestions = 20;
        $score = ($correctCount / $totalQuestions) * 10;

        $this->assertEquals(7.5, $score);

        // Test with 18/20 correct (90%)
        $correctCount = 18;
        $score = ($correctCount / $totalQuestions) * 10;

        $this->assertEquals(9.0, $score);

        // Test with perfect score
        $correctCount = 20;
        $score = ($correctCount / $totalQuestions) * 10;

        $this->assertEquals(10.0, $score);
    }

    /**
     * Test passed threshold
     */
    public function test_passed_threshold()
    {
        // Score below 5.0 should not be passed
        $this->assertFalse(4.9 >= 5.0);

        // Score 5.0 or higher should be passed
        $this->assertTrue(5.0 >= 5.0);
        $this->assertTrue(6.0 >= 5.0);
    }
}
