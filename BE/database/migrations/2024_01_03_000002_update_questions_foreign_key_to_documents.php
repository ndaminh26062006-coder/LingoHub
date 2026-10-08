<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Xóa foreign key cũ trỏ vào exams (đã đổi thành documents)
            $table->dropForeign(['exam_id']);

            // Đổi tên cột exam_id → document_id
            $table->renameColumn('exam_id', 'document_id');
        });

        Schema::table('questions', function (Blueprint $table) {
            // Thêm foreign key mới trỏ vào documents
            $table->foreign('document_id')->references('id')->on('documents')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['document_id']);
            $table->renameColumn('document_id', 'exam_id');
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->foreign('exam_id')->references('id')->on('exams')->cascadeOnDelete();
        });
    }
};
