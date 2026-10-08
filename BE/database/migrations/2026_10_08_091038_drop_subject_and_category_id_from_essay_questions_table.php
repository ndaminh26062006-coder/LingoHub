<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop constraints and columns
        Schema::table('essay_questions', function (Blueprint $table) {
            $table->dropColumn(['subject']);
        });
        
        // Drop category_id separately, dropping the foreign key first
        DB::statement('ALTER TABLE essay_questions DROP FOREIGN KEY essay_questions_category_id_foreign');
        
        Schema::table('essay_questions', function (Blueprint $table) {
            if (Schema::hasColumn('essay_questions', 'category_id')) {
                $table->dropColumn(['category_id']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('essay_questions', function (Blueprint $table) {
            // Restore columns for rollback
            if (!Schema::hasColumn('essay_questions', 'subject')) {
                $table->string('subject')->nullable()->after('title');
            }
            if (!Schema::hasColumn('essay_questions', 'category_id')) {
                $table->unsignedBigInteger('category_id')->nullable()->after('subject');
                $table->foreign('category_id')->references('id')->on('categories');
            }
        });
    }
};
