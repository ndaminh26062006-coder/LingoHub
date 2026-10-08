<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('subject');
            $table->text('description')->nullable();
            $table->integer('questions_count')->default(50);
            $table->integer('duration')->default(60); // minutes
            $table->enum('difficulty', ['Dễ', 'Trung bình', 'Khó'])->default('Trung bình');
            $table->enum('type', ['exam', 'practice'])->default('exam');
            $table->enum('status', ['published', 'draft'])->default('draft');
            $table->unsignedBigInteger('attempts')->default(0);
            $table->decimal('rating', 3, 1)->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
