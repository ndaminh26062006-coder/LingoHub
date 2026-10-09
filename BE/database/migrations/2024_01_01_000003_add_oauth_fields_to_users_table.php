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
        Schema::table('users', function (Blueprint $table) {
            // Add OAuth provider fields
            $table->string('provider')->nullable()->after('password'); // 'google', 'facebook'
            $table->string('provider_id')->nullable()->after('provider'); // Provider's unique ID
            $table->string('provider_avatar')->nullable()->after('provider_id'); // Provider's avatar URL
            
            // Index for faster lookups
            $table->unique(['provider', 'provider_id'])->after('provider_avatar');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['provider', 'provider_id']);
            $table->dropColumn(['provider', 'provider_id', 'provider_avatar']);
        });
    }
};
