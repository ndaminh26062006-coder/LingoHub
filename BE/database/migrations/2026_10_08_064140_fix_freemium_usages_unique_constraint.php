<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('freemium_usages', function (Blueprint $table) {
            // Drop old unique constraint if exists
            try {
                $table->dropUnique(['ip_address', 'device_id']);
            } catch (\Exception $e) {
                // Ignore if index doesn't exist
            }
            // Create new composite unique constraint with feature
            $table->unique(['ip_address', 'device_id', 'feature']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('freemium_usages', function (Blueprint $table) {
            $table->dropUnique(['ip_address', 'device_id', 'feature']);
        });
    }
};
