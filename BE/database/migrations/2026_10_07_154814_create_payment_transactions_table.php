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
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('reference_code', 255)->unique(); // Sepay reference_code
            $table->integer('amount'); // 49000, 99000, 129000, 199000
            $table->enum('plan', ['1month', '3month', '5month', 'full']);
            $table->json('subjects')->nullable(); // ["Triết học", ...]
            $table->enum('status', ['pending', 'success', 'failed'])->default('pending');
            $table->json('sepay_response')->nullable(); // Store full Sepay response
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->index(['user_id', 'status']);
            $table->index('reference_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
