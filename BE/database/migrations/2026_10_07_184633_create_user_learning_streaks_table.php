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
        Schema::create('user_learning_streaks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            
            // Core metrics
            $table->decimal('total_hours', 8, 2)->default(0);
            $table->integer('current_streak_days')->default(0);
            $table->date('last_activity_date')->nullable();
            $table->integer('longest_streak_days')->default(0);
            
            // Weekly/monthly aggregates
            $table->decimal('hours_this_week', 6, 2)->default(0);
            $table->decimal('hours_this_month', 6, 2)->default(0);
            $table->integer('exams_completed_week')->default(0);
            $table->integer('exams_completed_month')->default(0);
            
            // Overall stats
            $table->decimal('overall_accuracy', 5, 2)->default(0);
            $table->decimal('avg_speed_seconds', 6, 2)->default(0);
            
            $table->timestamps();
            
            // Foreign key
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            
            // Indexes
            $table->index('total_hours');
            $table->index('hours_this_week');
            $table->index('current_streak_days');
            $table->index('overall_accuracy');
            $table->index('avg_speed_seconds');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_learning_streaks');
    }
};
