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
        // Change plan enum values from 1month/3month/5month to 1subject/3subject/5subject
        Schema::table('payment_transactions', function (Blueprint $table) {
            $table->string('plan')->change(); // Change from enum to string to allow any value
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_transactions', function (Blueprint $table) {
            $table->enum('plan', ['1month', '3month', '5month', 'full'])->change();
        });
    }
};
