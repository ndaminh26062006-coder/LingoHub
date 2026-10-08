<?php
require "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$transactions = \DB::table("payment_transactions")
  ->orderBy("id", "desc")
  ->limit(3)
  ->get();

echo "Recent Transactions:\n";
foreach ($transactions as $txn) {
  echo "ID: {$txn->id}, Ref: {$txn->reference_code}, Amount: {$txn->amount}, Status: {$txn->status}\n";
}
