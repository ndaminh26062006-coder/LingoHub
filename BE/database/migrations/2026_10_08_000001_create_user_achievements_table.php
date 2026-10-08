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
        Schema::create('user_achievements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('achievement_key'); // 'streak_7', 'perfect_score', etc.
            $table->string('title');
            $table->text('description');
            $table->string('icon'); // emoji or icon name
            $table->string('color')->default('#6b7280'); // hex color
            $table->timestamp('unlocked_at')->nullable(); // NULL if locked
            $table->integer('progress')->default(0); // For partial achievements (e.g., 5 of 7 days)
            $table->timestamps();

            // Foreign key
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();

            // Indexes
            $table->index('user_id');
            $table->index('unlocked_at');
            $table->unique(['user_id', 'achievement_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_achievements');
    }
};
