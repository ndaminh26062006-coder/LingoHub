<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_document_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('document_id')->constrained()->onDelete('cascade');
            
            // Score data
            $table->float('score')->default(0); // 0-10
            $table->integer('correct_count')->default(0);
            $table->integer('total_questions')->default(0);
            $table->float('accuracy_percent')->default(0); // 0-100
            
            // Time data
            $table->integer('time_spent_seconds')->default(0);
            $table->float('avg_time_per_question')->nullable();
            
            // Answer tracking
            $table->integer('answered_count')->default(0);
            $table->integer('skipped_count')->default(0);
            
            // Status
            $table->boolean('is_passed')->default(false);
            $table->timestamp('completed_at')->nullable();
            
            $table->timestamps();
            
            // Indexes for faster queries
            $table->index('user_id');
            $table->index('document_id');
            $table->index('completed_at');
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_document_submissions');
    }
};
