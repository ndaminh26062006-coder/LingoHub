<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->integer('order')->default(0);
            $table->text('content');
            $table->json('options'); // [{"id":"A","text":"..."}, ...]
            $table->string('correct_answer', 1); // A/B/C/D
            $table->text('explanation')->nullable();
            $table->enum('difficulty', ['Dễ', 'Trung bình', 'Khó'])->default('Trung bình');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
