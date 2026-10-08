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
        Schema::create('freemium_usages', function (Blueprint $table) {
            $table->id();
            $table->ipAddress('ip_address'); // IPv4/IPv6
            $table->string('device_id', 255); // Browser fingerprint
            $table->string('feature', 50); // 'essay' | 'exam' | 'document' | 'flashcard'
            $table->integer('used_count')->default(0);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
            
            $table->unique(['ip_address', 'device_id']);
            $table->index('ip_address');
            $table->index('used_count');
            $table->index('last_used_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('freemium_usages');
    }
};
