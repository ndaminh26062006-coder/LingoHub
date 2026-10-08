<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reference_code',
        'amount',
        'plan',
        'subjects',
        'status',
        'sepay_response',
    ];

    protected $casts = [
        'subjects' => 'array',
        'sepay_response' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeSuccess($query)
    {
        return $query->where('status', 'success');
    }

    public function scopeRecent($query)
    {
        return $query->orderByDesc('created_at');
    }

    // Methods
    public function markSuccess($webhookData)
    {
        $this->update([
            'status' => 'success',
            'sepay_response' => $webhookData,
        ]);
    }

    public function markFailed($errorData)
    {
        $this->update([
            'status' => 'failed',
            'sepay_response' => $errorData,
        ]);
    }
}
