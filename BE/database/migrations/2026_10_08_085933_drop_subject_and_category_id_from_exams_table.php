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
        // First drop the foreign key
        DB::statement('ALTER TABLE exams DROP FOREIGN KEY exams_new_category_fk');
        
        // Then drop the columns that need to be removed
        Schema::table('exams', function (Blueprint $table) {
            // Only drop if they exist
            if (Schema::hasColumn('exams', 'subject')) {
                $table->dropColumn(['subject']);
            }
            if (Schema::hasColumn('exams', 'category_id')) {
                $table->dropColumn(['category_id']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            // Restore the columns for rollback
            $table->string('subject')->nullable()->after('title');
            $table->unsignedBigInteger('category_id')->nullable()->after('subject');
        });
    }
};
