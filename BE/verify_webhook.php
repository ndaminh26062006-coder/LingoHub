<?php
require "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== PAYMENT TRANSACTION ===\n";
$txn = \DB::table("payment_transactions")->where("reference_code", "LINGOHUB_4_svbbBQJZLn_1791392443")->first();
echo "Status: " . $txn->status . "\n";
echo "Updated At: " . $txn->updated_at . "\n\n";

echo "=== SUBSCRIPTION ===\n";
$sub = \DB::table("subscriptions")->where("payment_reference", "LINGOHUB_4_svbbBQJZLn_1791392443")->first();
if ($sub) {
  echo "Plan: " . $sub->plan . "\n";
  echo "Valid From: " . $sub->valid_from . "\n";
  echo "Valid Until: " . $sub->valid_until . "\n";
  echo "Is Active: " . $sub->is_active . "\n";
} else {
  echo "No subscription found!\n";
}
