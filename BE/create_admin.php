<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Admin account credentials
$adminEmail = 'admin@lingohub.com';
$adminPassword = 'admin@123456';
$adminName = 'Admin User';

// Check if admin already exists
$existingAdmin = User::where('email', $adminEmail)->first();
if ($existingAdmin) {
    echo "❌ Admin account already exists with email: {$adminEmail}\n";
    exit(1);
}

// Create admin account
$admin = User::create([
    'name' => $adminName,
    'email' => $adminEmail,
    'password' => Hash::make($adminPassword),
    'role' => 'admin',
    'school' => 'LingoHub Admin',
    'email_verified_at' => now(),
    'total_learning_hours' => 0,
    'overall_accuracy' => 0,
    'avg_speed_seconds' => 0,
    'exams_completed' => 0,
]);

echo "✅ Admin account created successfully!\n";
echo "📧 Email: {$adminEmail}\n";
echo "🔑 Password: {$adminPassword}\n";
echo "👤 Name: {$adminName}\n";
echo "🆔 ID: {$admin->id}\n";
echo "\n⚠️  Please change this password after first login!\n";
