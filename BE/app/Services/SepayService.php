<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class SepayService
{
    private $apiKey;
    private $apiUrl = 'https://api.sepay.vn/v2';
    private $bankAccount = '0772052220';
    private $bankCode = 'MB'; // MBBank
    private $accountName = 'LE THI KIEU VY';

    public function __construct()
    {
        $this->apiKey = config('services.sepay.api_key');
    }

    /**
     * Create direct payment transfer link (not QR)
     * User-friendly: click link → auto-fills payment details
     */
    public function createTransfer($amount, $description, $referenceCode, $accountNumber, $accountName)
    {
        try {
            // Sepay Direct Transfer Link format
            // Reference: https://api.sepay.vn/docs
            $checkoutUrl = "https://app.sepay.vn/pay?amount=" . (int)$amount
                . "&bankAccount=" . urlencode($accountNumber)
                . "&bankAccountName=" . urlencode($accountName)
                . "&description=" . urlencode($description)
                . "&referenceCode=" . urlencode($referenceCode);
            
            return [
                'success' => true,
                'id' => 'sepay_' . $referenceCode,
                'reference_code' => $referenceCode,
                'checkout_url' => $checkoutUrl,
                'amount' => $amount,
                'description' => $description,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Generate QR code for payment (Sepay API)
     * 
     * @param float $amount Amount in VND
     * @param string $description Payment description (nội dung chuyển)
     * @param string $transactionId Unique transaction ID
     * @return array QR code data or URL
     */
    public function generateQR($amount, $description, $transactionId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . '/qr/generate', [
                'bank' => $this->bankCode,
                'account_no' => $this->bankAccount,
                'account_name' => $this->accountName,
                'amount' => (int)$amount,
                'description' => $description,
                'template' => 'compact',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // Sepay returns: { success: true, data: { qr_url, ... } }
                $qrUrl = $data['data']['qr_url'] ?? $data['qr_url'] ?? null;
                
                if ($qrUrl) {
                    return [
                        'success' => true,
                        'qr_url' => $qrUrl,
                        'qr_data' => $data['data'] ?? $data,
                        'amount' => $amount,
                        'description' => $description,
                        'transaction_id' => $transactionId,
                    ];
                }
            }

            // Fallback: if Sepay fails, return error
            $errorMsg = $response->json('message') ?? 'Failed to generate QR';
            \Log::warning('Sepay QR generation failed', [
                'status' => $response->status(),
                'message' => $errorMsg,
                'response' => $response->json()
            ]);

            return [
                'success' => false,
                'error' => $errorMsg,
            ];
        } catch (\Exception $e) {
            \Log::error('Sepay QR exception: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Verify webhook signature from Sepay
     * 
     * @param array $data Webhook data
     * @param string $signature Signature from Sepay
     * @return bool
     */
    public function verifySignature($data, $signature)
    {
        // Sepay signs the data with their secret key
        // We need to verify using the public key
        try {
            // Sort data alphabetically
            ksort($data);
            $sortedData = json_encode($data, JSON_UNESCAPED_SLASHES);
            
            // Create signature
            $expectedSignature = hash('sha256', $sortedData . $this->apiKey);
            
            return hash_equals($expectedSignature, $signature);
        } catch (\Exception $e) {
            \Log::error('Sepay signature verification error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get transaction status from Sepay
     * 
     * @param string $transactionId Transaction ID
     * @return array Transaction status
     */
    public function getTransactionStatus($transactionId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->get($this->apiUrl . '/transactions/' . $transactionId);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json('data'),
                ];
            }

            return [
                'success' => false,
                'error' => $response->json('message') ?? 'Failed to get transaction status',
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Generate unique reference code for QR
     * 
     * @return string
     */
    public function generateReferenceCode()
    {
        return 'LH' . date('YmdHis') . Str::random(6);
    }

    /**
     * Parse webhook data from Sepay
     * 
     * @param array $webhookData
     * @return array Parsed data
     */
    public function parseWebhookData($webhookData)
    {
        return [
            'transaction_id' => $webhookData['id'] ?? null,
            'reference_code' => $webhookData['description'] ?? null,
            'amount' => $webhookData['amount'] ?? 0,
            'from_account' => $webhookData['initiation_bank_account_number'] ?? null,
            'from_name' => $webhookData['initiation_bank_account_name'] ?? null,
            'status' => $webhookData['transaction_date'] ? 'success' : 'pending',
            'paid_at' => $webhookData['transaction_date'] ?? null,
            'raw_data' => $webhookData,
        ];
    }

    /**
     * Format amount for Sepay (remove commas, convert to integer)
     * 
     * @param mixed $amount
     * @return int
     */
    public function formatAmount($amount)
    {
        return (int)str_replace(',', '', $amount);
    }
}
