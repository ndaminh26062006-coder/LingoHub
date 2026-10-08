<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flashcard_decks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('subject')->nullable();
            $table->string('icon')->default('');
            $table->string('color')->default('#1B3A6B');
            $table->enum('visibility', ['public', 'private'])->default('private');
            $table->enum('owner_type', ['admin', 'user'])->default('user');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['published', 'draft'])->default('published');
            $table->unsignedInteger('likes')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flashcard_decks');
    }
};
