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
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('likeable_type'); // 'Document', 'Exam', 'EssayQuestion', 'FlashcardDeck'
            $table->unsignedBigInteger('likeable_id');
            $table->boolean('is_liked')->default(true); // true = like (👍), false = dislike (👎)
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['user_id', 'likeable_type', 'likeable_id']); // One like/dislike per user per item
            $table->index(['likeable_type', 'likeable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
