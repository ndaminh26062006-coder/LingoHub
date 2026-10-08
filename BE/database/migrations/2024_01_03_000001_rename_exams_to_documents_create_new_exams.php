<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Đổi tên bảng exams → documents (giữ toàn bộ dữ liệu)
        Schema::rename('exams', 'documents');

        // 2. Tạo bảng exams mới (cho đề thi thử - thi thật)
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('title');
            $table->string('subject')->nullable();
            $table->text('description')->nullable();
            $table->integer('questions_count')->default(50);
            $table->integer('duration')->default(60);
            $table->enum('difficulty', ['Dễ', 'Trung bình', 'Khó'])->default('Trung bình');
            $table->enum('type', ['exam', 'practice'])->default('exam');
            $table->enum('status', ['published', 'draft'])->default('draft');
            $table->unsignedBigInteger('attempts')->default(0);
            $table->decimal('rating', 3, 1)->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            // Đặt tên constraint khác để tránh trùng với documents
            $table->foreign('category_id', 'exams_new_category_fk')
                  ->references('id')->on('categories')->nullOnDelete();
            $table->foreign('created_by', 'exams_new_created_by_fk')
                  ->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        // Xóa bảng exams mới
        Schema::dropIfExists('exams');

        // Đổi lại documents → exams
        Schema::rename('documents', 'exams');
    }
};
