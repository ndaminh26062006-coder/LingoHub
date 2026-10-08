<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['student', 'admin'])->default('student')->after('email');
            $table->string('school')->nullable()->after('role');
            $table->string('major')->nullable()->after('school');
            $table->string('year')->nullable()->after('major');
            $table->string('phone')->nullable()->after('year');
            $table->enum('status', ['active', 'blocked'])->default('active')->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'school', 'major', 'year', 'phone', 'status']);
        });
    }
};
