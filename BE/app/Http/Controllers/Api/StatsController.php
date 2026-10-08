<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Models\Exam;
use App\Models\Document;
use App\Models\ExamQuestion;
use App\Models\Question;
use App\Models\Subject;

class StatsController extends Controller
{
    /**
     * GET /api/stats/dashboard
     * Public endpoint for homepage statistics
     * 
     * Returns:
     * - questions: Total questions from both exams and documents (formatted with +)
     * - exams: Total exams count (formatted with +)
     * - attempts: Total attempts from exams.attempts column (formatted with +)
     * - subjects: Total subjects count (no formatting)
     */
    public function dashboard()
    {
        // Count questions from both exam_questions and questions tables
        $totalQuestions = ExamQuestion::count() + Question::count();
        
        // Count exams (only published)
        $totalExams = Exam::where('status', 'published')->count();
        
        // Sum attempts from exams table
        $totalAttempts = Exam::sum('attempts') ?? 0;
        
        // Count subjects
        $totalSubjects = Subject::count();
        
        return response()->json([
            'questions' => $this->formatNumber($totalQuestions),
            'exams' => $this->formatNumber($totalExams),
            'attempts' => $this->formatNumber($totalAttempts),
            'subjects' => $totalSubjects,
            // Raw values for debugging
            '_raw' => [
                'questions' => $totalQuestions,
                'exams' => $totalExams,
                'attempts' => $totalAttempts,
                'subjects' => $totalSubjects,
            ]
        ]);
    }
    
    /**
     * Format number for display
     * Examples: 1087 -> "1000+", 500 -> "500+", 12 -> "12"
     * 
     * @param int $number
     * @return string
     */
    private function formatNumber($number)
    {
        if ($number < 100) {
            return (string)$number;
        } elseif ($number < 1000) {
            // Round to nearest 10: 587 -> 590
            $rounded = ceil($number / 10) * 10;
            return $rounded . '+';
        } else {
            // Round to nearest 1000: 1087 -> 1000, 1587 -> 2000
            $rounded = round($number / 1000) * 1000;
            return number_format($rounded / 1000, 0) . 'K+';
        }
    }
}
