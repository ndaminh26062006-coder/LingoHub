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
        // For MySQL, we need to modify the enum type properly
        // First, convert old values to 'full' (since all plans now default to 'full')
        DB::statement("UPDATE subscriptions SET plan = 'full' WHERE plan IN ('1month', '3month', '5month')");

        // Now modify the enum column type
        DB::statement("ALTER TABLE subscriptions MODIFY plan ENUM('1subject', '3subject', '5subject', 'full')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to old enum values
        DB::statement("ALTER TABLE subscriptions MODIFY plan ENUM('1month', '3month', '5month', 'full')");
        DB::statement("UPDATE subscriptions SET plan = '1month' WHERE plan = 'full'");
    }
};

