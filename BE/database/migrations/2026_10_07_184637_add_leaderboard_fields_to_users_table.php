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
        Schema::table('users', function (Blueprint $table) {
            // Denormalized fields for fast leaderboard queries
            $table->decimal('total_learning_hours', 8, 2)->default(0)->after('status');
            $table->decimal('overall_accuracy', 5, 2)->default(0)->after('total_learning_hours');
            $table->decimal('avg_speed_seconds', 6, 2)->default(0)->after('overall_accuracy');
            $table->integer('exams_completed')->default(0)->after('avg_speed_seconds');
            $table->timestamp('last_exam_date')->nullable()->after('exams_completed');
            
            // Indexes
            $table->index('total_learning_hours');
            $table->index('overall_accuracy');
            $table->index('avg_speed_seconds');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'total_learning_hours',
                'overall_accuracy',
                'avg_speed_seconds',
                'exams_completed',
                'last_exam_date',
            ]);
        });
    }
};
