<?php
require "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$latest = \DB::table("payment_transactions")->latest()->first();
echo "Reference Code: " . $latest->reference_code . PHP_EOL;
echo "Amount: " . $latest->amount . PHP_EOL;
echo "Status: " . $latest->status . PHP_EOL;
