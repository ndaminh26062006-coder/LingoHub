<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Bảng subjects: môn học thuộc 1 danh mục
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->default('📖');
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'draft'])->default('active');
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Thêm subject_id và chapter vào documents
        Schema::table('documents', function (Blueprint $table) {
            $table->foreignId('subject_id')
                  ->nullable()
                  ->after('category_id')
                  ->constrained('subjects')
                  ->nullOnDelete();
            $table->string('chapter')->nullable()->after('subject_id');
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropForeign(['subject_id']);
            $table->dropColumn(['subject_id', 'chapter']);
        });
        Schema::dropIfExists('subjects');
    }
};
