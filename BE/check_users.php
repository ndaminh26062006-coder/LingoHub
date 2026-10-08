<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

// Check users count
$count = User::count();
echo "Total users in database: $count\n";

if ($count > 0) {
    echo "\nExisting users:\n";
    $users = User::select('id', 'name', 'email', 'role')->get();
    foreach ($users as $user) {
        echo "  ID: {$user->id}, Name: {$user->name}, Email: {$user->email}, Role: {$user->role}\n";
    }
} else {
    echo "No users found in database!\n";
}
