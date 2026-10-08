<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Thêm subject_id + chapter vào exams (bỏ category_id và subject)
        Schema::table('exams', function (Blueprint $table) {
            $table->foreignId('subject_id')
                  ->nullable()
                  ->after('id')
                  ->constrained('subjects')
                  ->nullOnDelete();
            $table->string('chapter')->nullable()->after('subject_id');
        });

        // Bảng câu hỏi riêng cho đề thi thử
        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->cascadeOnDelete();
            $table->integer('order')->default(0);
            $table->text('content');
            $table->json('options');
            $table->string('correct_answer', 1);
            $table->text('explanation')->nullable();
            $table->integer('difficulty')->default(0); // 0=easy,1=medium,2=hard (simple int)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_questions');
        Schema::table('exams', function (Blueprint $table) {
            $table->dropForeign(['subject_id']);
            $table->dropColumn(['subject_id', 'chapter']);
        });
    }
};
