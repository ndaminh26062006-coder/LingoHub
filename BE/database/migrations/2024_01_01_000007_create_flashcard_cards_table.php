<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flashcard_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deck_id')->constrained('flashcard_decks')->cascadeOnDelete();
            $table->text('front');
            $table->text('back');
            $table->string('subject')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flashcard_cards');
    }
};
