<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('essay_questions', function (Blueprint $table) {
            $table->string('chapter')->nullable()->after('subject');
            $table->foreignId('subject_id')
                  ->nullable()
                  ->after('category_id')
                  ->constrained('subjects')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('essay_questions', function (Blueprint $table) {
            $table->dropForeign(['subject_id']);
            $table->dropColumn(['chapter', 'subject_id']);
        });
    }
};
