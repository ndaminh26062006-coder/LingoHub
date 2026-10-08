<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add admin_role column: null (not admin), 'super' (full admin), 'content' (content-only admin)
            $table->enum('admin_role', ['super', 'content'])->nullable()->after('role')->comment('Admin role: super=full admin, content=content manager only');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('admin_role');
        });
    }
};
