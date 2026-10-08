<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('exam_questions', function (Blueprint $table) {
            $table->string('type')->default('multiple_choice')->after('content'); // multiple_choice, essay, scenario
            $table->json('options')->nullable()->change();
            $table->string('correct_answer', 1)->nullable()->change();
            $table->json('sub_questions')->nullable()->after('options'); // for essay & scenario
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_questions', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->dropColumn('sub_questions');
            $table->json('options')->nullable(false)->change();
            $table->string('correct_answer', 1)->nullable(false)->change();
        });
    }
};
