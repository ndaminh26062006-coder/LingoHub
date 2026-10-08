<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('essay_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('subject');
            $table->text('question');
            $table->text('hint')->nullable();
            $table->longText('sample_answer')->nullable();
            $table->integer('time_limit')->default(45); // minutes
            $table->enum('difficulty', ['Dễ', 'Trung bình', 'Khó'])->default('Trung bình');
            $table->enum('status', ['published', 'draft'])->default('draft');
            $table->unsignedBigInteger('attempts')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('essay_questions');
    }
};
