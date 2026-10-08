<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Update order based on id (existing questions)
        DB::statement('SET @row_number = 0;');
        DB::statement('UPDATE exam_questions SET `order` = (@row_number := @row_number + 1) WHERE `order` = 0 ORDER BY id;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('UPDATE exam_questions SET `order` = 0;');
    }
};
