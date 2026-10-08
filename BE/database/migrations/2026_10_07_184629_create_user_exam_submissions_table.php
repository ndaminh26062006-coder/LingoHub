<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_exam_submissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('exam_id');
            
            // Core metrics
            $table->decimal('score', 4, 2);           // 0.0 to 10.0
            $table->integer('correct_count');         // Number of correct answers
            $table->integer('total_questions');       // Total questions
            $table->decimal('accuracy_percent', 5, 2); // Percentage 0-100
            $table->integer('time_spent_seconds')->nullable();
            
            // Performance tracking
            $table->decimal('avg_time_per_question', 6, 2)->nullable();
            $table->integer('answered_count');
            $table->integer('skipped_count')->default(0);
            
            // Session info
            $table->enum('mode', ['exam', 'practice'])->default('exam');
            $table->boolean('is_passed')->default(false);
            
            $table->timestamp('completed_at');
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('exam_id')->references('id')->on('exams')->cascadeOnDelete();
            
            // Indexes for queries
            $table->index('user_id');
            $table->index('exam_id');
            $table->index(['user_id', 'created_at']);
            $table->index('accuracy_percent');
            $table->index('avg_time_per_question');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_exam_submissions');
    }
};
